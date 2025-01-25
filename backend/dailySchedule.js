// dailySchedule.js is used to check the daily schedule of games in the database
require('dotenv').config()
const { Client } = require('pg')
const { ingestData } = require('./ingest')

async function runDailySchedule() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })

    try {
        await client.connect()
        console.log('Connected to Aurora in dailySchedule.js')

        // Example: find all games that are scheduled for "today"
        // and not in a "final/post" state
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

        // Log the games that are scheduled for today
        console.log(`\n--- Today's Games (Not Final) ---`);
        console.log(`Leagues with upcoming or in-progress games today:`, leaguesWithGames)

        // Filter the leagueConfigs to only include leagues with games today
        const leagueConfigs = require('./leagueConfigs');
        const leaguesToPoll = leagueConfigs.filter(cfg => leaguesWithGames.includes(cfg.name));

        // If there are games today, ingest the data for those leagues
        if (leaguesToPoll.length > 0) {
            console.log(`\nPolling only these leagues:`, leaguesToPoll.map(l => l.name));
            await ingestData(leaguesToPoll);
        } else {
            console.log(`\nNo leagues have upcoming games today. Skipping ingestion for now.`);
        };

        console.log('\nDaily schedule check complete.')
    } catch (err) {
        console.error('Error in runDailySchedule:', err)
    } finally {
        await client.end()
    }
}

module.exports = { runDailySchedule }
