// index.js
require('dotenv').config()
// const axios = require('axios')
const { Client } = require('pg') // For PostgreSQL. Use mysql2 if Aurora MySQL.

async function main() {
    // 1) Connect to Aurora
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })

    try {
        await client.connect()
        console.log('Connected to Aurora successfully.')
    } catch (err) {
        console.error('Error occurred:', err)
    } finally {
        // 4) Close the DB connection
        await client.end()
    }
}

main()
