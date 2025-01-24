require('dotenv').config()
const axios = require('axios')
const { Client } = require('pg')
const leagueConfigs = require('./leagueConfigs')

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

    // 2. Fetch data from ESPN API
    for (const { name, slug } of leagueConfigs) {
      const url = `${process.env.ESPN_API_URL}/${slug}/scoreboard`;

      // Log the fetch
      console.log(`Fetched data for ${name} from (${slug})...`);
      const response = await axios.get(url);

      // ESPN scoreboard data often has `data.events`, each event is a "game"
      const games = response.data?.events || [];
      console.log(`Fetched ${games.length} games for ${name}.`);

      // Extracting the team logo and team names
      const cleanedData = games.map((game) => {
        const competition = game?.competitions?.[0] || {};
        const team1 = competition.competitors?.[0];
        const team2 = competition.competitors?.[1];

        return {
          externalGameId: game.id,
          league: name,
          link: game.links?.[0]?.href || null,
          homeTeam: {
            name: team1?.team?.shortDisplayName || 'TBD',
            logo: team1?.team?.logo || null,
            score: team1?.score ?? 'N/A',
          },
          awayTeam: {
            name: team2?.team?.shortDisplayName || 'TBD',
            logo: team2?.team?.logo || null,
            score: team2?.score ?? 'N/A',
          },
          startTime: game.date,
          shortDetail: game.status?.type?.shortDetail || 'N/A',
          state: game.status?.type?.state || 'N/A',
        };
      });

      // Log the cleaned data for that league
      console.log(cleanedData);
    }

    // Finished fetching data for all leagues
    console.log('All games inserted or updated successfully!')
  } catch (err) {
    console.error('Error occurred:', err)
  } finally {
    // Close the DB connection
    await client.end()
  }
}

main()
