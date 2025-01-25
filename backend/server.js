// server.js is the main entry point for the backend. It orchestrates the ingest and daily schedule checks.
const { ingestData } = require('./ingest')
const { runDailySchedule } = require('./dailySchedule')
const schedule = require('node-schedule')

async function main() {
    console.log('📌 server.js started. Will do daily schedule at 6 AM plus any dynamic jobs.')

    // 1. Do an initial ingest of all leagues
    console.log('Starting ESPN ingest...')
    await ingestData()

    // 2. Do a daily schedule check
    console.log('Starting daily schedule check...')
    await runDailySchedule()

    // 3. Schedule a daily run at 6:00 AM
    schedule.scheduleJob('0 6 * * *', async () => {
        console.log('[DailySchedule] Running again at 6 AM...')
        await runDailySchedule()
    })
}

// Kick it off
main().catch(err => console.error('server.js Error:', err))

