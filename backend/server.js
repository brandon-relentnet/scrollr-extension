// server.js is the main entry point for the backend. It orchestrates the ingest and daily schedule checks.
const schedule = require('node-schedule')
const { startApiServer } = require('./api')
const { ingestData } = require('./ingest')
const { runDailySchedule } = require('./dailySchedule')

async function main() {
    console.log('📌 server.js started. Will do daily schedule at 6 AM plus any dynamic jobs.')

    // 1. Start Express API on port 4000
    await startApiServer(4000)

    // 2. Run initial ESPN ingest
    console.log('Starting ESPN ingest...')
    await ingestData()

    // 3. Run daily schedule check
    console.log('Starting daily schedule check...')
    await runDailySchedule()

    // 4. Schedule a daily run at 6:00 AM
    schedule.scheduleJob('0 6 * * *', async () => {
        console.log('[DailySchedule] Running again at 6 AM...')
        await runDailySchedule()
    })
}

main().catch(err => console.error('server.js Error:', err))