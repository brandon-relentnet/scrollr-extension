// server.js is the main entry point for the backend. It orchestrates the ingest and daily schedule checks.
const { ingestData } = require('./ingest')
const { runDailySchedule } = require('./dailySchedule')

async function main() {
    // 1) Run ingest to fetch ESPN data and upsert to DB
    console.log('Starting ESPN ingest...')
    await ingestData()

    // 2) Run daily schedule check
    console.log('\nNow checking today\'s schedule...')
    await runDailySchedule()

    console.log('\nserver.js - All done!')
}

// Kick it off
main().catch(err => console.error('server.js Error:', err))
