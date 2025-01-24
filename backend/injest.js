// ingest.js
require('dotenv').config()
const axios = require('axios')
const { Client } = require('pg')

async function main() {
  // 1. Connect to Aurora
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

    // 2. Fetch data from ESPN scoreboard
    const espnUrl = process.env.ESPN_API_URL // e.g. https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard
    const response = await axios.get(espnUrl)
    const data = response.data

    // ESPN scoreboard data often has `data.events`, each event is a "game"
    const games = data?.events || []

    // Total games fetched
    console.log(`Fetched ${games.length} games from ESPN.`)

    // Extracting the team logo and team names
    const gameData = games.map(game => {
      const team1 = game.competitions[0].competitors[0];
      const team2 = game.competitions[0].competitors[1];
      return {
        team1: team1.team.shortDisplayName,
        team1Logo: team1.team.logo,
        team1Score: team1.score,
        team2: team2.team.shortDisplayName,
        team2Logo: team2.team.logo,
        team2Score: team2.score
      };
    });

    // Log the game data
    console.log(gameData);

    console.log('All games inserted or updated successfully!')
  } catch (err) {
    console.error('Error occurred:', err)
  } finally {
    // 5. Close the DB connection
    await client.end()
  }
}

main()
