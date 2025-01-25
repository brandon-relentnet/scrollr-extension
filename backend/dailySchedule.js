// dailySchedule.js is used to check the daily schedule of games in the database
require('dotenv').config()
const { Client } = require('pg')
const schedule = require('node-schedule')
const { ingestData } = require('./ingest')

// We'll keep these scheduled jobs in memory so we can refer or cancel if needed
const scheduledLeagueJobs = {}

/**
 * runDailySchedule:
 * 1. Finds all leagues with games "today" that are not final
 * 2. For each league, find the earliest start time among today's games
 * 3. Schedule a "Frequent Poll" job to begin ~15 minutes before that start
 */
async function runDailySchedule() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })

    try {
        await client.connect();
        console.log('Connected to Aurora in dailySchedule.js');

        // 1. find all games that are scheduled for "today" and not in a "final/post" state
        const query = `
            SELECT *
            FROM games
            WHERE
                DATE(start_time AT TIME ZONE 'UTC') = CURRENT_DATE AT TIME ZONE 'UTC'
                AND state NOT IN ('post', 'completed', 'final')
            ORDER BY start_time ASC
        `

        // Fetch the games that are scheduled for today
        const result = await client.query(query);
        const leaguesWithGames = result.rows.map(row => row.league);

        if (result.rows.length === 0) {
            console.log('No upcoming games today. Nothing to schedule.'); 
            return;
        }

        // Log the games that are scheduled for today
        console.log(`\n--- Today's Games (Not Final) ---`);
        console.log(`Leagues with upcoming or in-progress games today:`, [...new Set(leaguesWithGames)]);

        // Filter the leagueConfigs to only include leagues with games today
        const leagueConfigs = require('./leagueConfigs');
        const leaguesToPoll = leagueConfigs.filter(cfg => leaguesWithGames.includes(cfg.name));

        console.log(`\nPolling only these leagues:`, leaguesToPoll.map(l => l.name));
        // await ingestData(leaguesToPoll);

        // 2. Group games by league, find earliest start time, and also track if any game is "in progress".
        const leagueMap = {}
        for (const row of result.rows) {
            const { league, start_time, state } = row

            // Initialize leagueMap entry if not present
            if (!leagueMap[league]) {
                leagueMap[league] = {
                    earliestStart: start_time,
                    hasInProgress: false,
                }
            }

            // Update earliestStart if this start_time is earlier
            if (start_time < leagueMap[league].earliestStart) {
                leagueMap[league].earliestStart = start_time
            }

            // If we find a game with state = 'in', mark hasInProgress = true
            if (state === 'in') {
                leagueMap[league].hasInProgress = true
            }
        }

        // 3. For each league, schedule a job to start frequent polling 15 minutes before earliestStart
        for (const league of Object.keys(leagueMap)) {
            const { earliestStart, hasInProgress } = leagueMap[league]
            const earliestStartTime = new Date(earliestStart)
            const pollStartTime = new Date(earliestStartTime.getTime() - 15 * 60_000) // 15 minutes earlier

            const now = new Date()

            // If earliestStart is already in the past OR we have at least one game "in progress," start immediately
            if (pollStartTime < now || hasInProgress) {
                console.log(`${league}: Earliest start time is soon/past OR a game is in-progress. Starting frequent poll now.`)
                startFrequentPoll(league)
            } else {
                // Otherwise, schedule a future job
                console.log(`${league}: Scheduling frequent poll to start at ${pollStartTime}.`)
                schedule.scheduleJob(pollStartTime, () => {
                    console.log(`Time reached for ${league}. Starting frequent poll...`)
                    startFrequentPoll(league)
                })
            }
        }

        console.log('\nDaily schedule check complete.');
    } catch (err) {
        console.error('Error in runDailySchedule:', err)
    } finally {
        await client.end()
    }
}

/**
 * startFrequentPoll(league):
 *   - Creates a node-schedule job that runs every 1 minute
 *   - Each run calls ingestData([ thatLeague ])
 *   - After ingest, checks if all that league's games are final. If so, cancel the job.
 */
function startFrequentPoll(league) {
    // If we already have a job for that league, cancel it first (if you want to avoid duplicates)
    if (scheduledLeagueJobs[league]) {
        console.log(`Cancelling existing frequent poll job for ${league} before starting a new one.`)
        scheduledLeagueJobs[league].cancel()
        delete scheduledLeagueJobs[league]
    }

    // Schedule a repeating job every minute: "*/1 * * * *"
    const job = schedule.scheduleJob(`*/1 * * * *`, async function () {
        console.log(`\n[${new Date().toISOString()}] Frequent poll for ${league}.`)

        try {
            // Poll only this league
            await ingestData([{ name: league, slug: getSlugForLeague(league) }])

            // Now check if all games for league are final
            const allDone = await areAllGamesFinal(league)
            if (allDone) {
                console.log(`All ${league} games are final. Cancelling frequent poll.`)
                job.cancel() // stop this repeating job
                delete scheduledLeagueJobs[league]
            }
        } catch (err) {
            console.error(`Error during frequent poll of ${league}:`, err)
        }
    })

    // Store the job reference in memory so we can manage it if needed
    scheduledLeagueJobs[league] = job
}

/**
 * areAllGamesFinal(league) -> checks DB to see if all games for that league today are final
 */
async function areAllGamesFinal(league) {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })

    try {
        await client.connect()
        const query = `
            SELECT COUNT(*) as cnt
            FROM games
            WHERE league = $1
              AND DATE(start_time AT TIME ZONE 'UTC') = CURRENT_DATE AT TIME ZONE 'UTC'
              AND state NOT IN ('post', 'completed', 'final')
        `
        const res = await client.query(query, [league])

        // If cnt = 0, means there are no non-final games left
        const countNonFinal = parseInt(res.rows[0].cnt, 10)
        return (countNonFinal === 0)
    } catch (err) {
        console.error('areAllGamesFinal error:', err)
        // If there's an error, let's assume false to keep polling
        return false
    } finally {
        await client.end()
    }
}

/**
 * Helper function to get the "slug" for a given league name.
 * If your leagueConfigs array uses the exact same name field,
 * you can store a small map or find the config by name.
 */
function getSlugForLeague(leagueName) {
    // Example if your leagueConfigs has: { name: 'NFL', slug: 'football/nfl' }
    const leagueConfigs = require('./leagueConfigs')
    const found = leagueConfigs.find(cfg => cfg.name === leagueName)
    return found ? found.slug : null
}

module.exports = { runDailySchedule }
