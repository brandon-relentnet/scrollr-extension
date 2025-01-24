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

    // 2. Prepare the upsert query for the single 'games' table
    const upsertQuery = `
      INSERT INTO games (
        league,
        external_game_id,
        link,
        home_team_name,
        home_team_logo,
        home_team_score,
        away_team_name,
        away_team_logo,
        away_team_score,
        start_time,
        short_detail,
        state
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (league, external_game_id)
      DO UPDATE
        SET link             = EXCLUDED.link,
            home_team_name   = EXCLUDED.home_team_name,
            home_team_logo   = EXCLUDED.home_team_logo,
            home_team_score  = EXCLUDED.home_team_score,
            away_team_name   = EXCLUDED.away_team_name,
            away_team_logo   = EXCLUDED.away_team_logo,
            away_team_score  = EXCLUDED.away_team_score,
            start_time       = EXCLUDED.start_time,
            short_detail     = EXCLUDED.short_detail,
            state            = EXCLUDED.state
    `;

    // 3. Fetch data from ESPN API for each league
    for (const { name, slug } of leagueConfigs) {
      const url = `${process.env.ESPN_API_URL}/${slug}/scoreboard`;

      // Log the fetch
      console.log(`Fetched data for ${name} from (${slug})...`);
      const response = await axios.get(url);

      // ESPN scoreboard data has `data.events`, each event is a "game"
      const games = response.data?.events || [];
      console.log(`Fetched ${games.length} games for ${name}.`);

      // 4. Extracting the team logo and team names
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
            score: parseInt(team1?.score, 10) || 0,
          },
          awayTeam: {
            name: team2?.team?.shortDisplayName || 'TBD',
            logo: team2?.team?.logo || null,
            score: parseInt(team2?.score, 10) || 0,
          },
          startTime: game.date,
          shortDetail: game.status?.type?.shortDetail || 'N/A',
          state: game.status?.type?.state || 'N/A',
        };
      });

      // 5. Upsert each cleaned object into the 'games' table
      for (const g of cleanedData) {
        await client.query(upsertQuery, [
          g.league,
          g.externalGameId,
          g.link,
          g.homeTeam.name,
          g.homeTeam.logo,
          g.homeTeam.score,
          g.awayTeam.name,
          g.awayTeam.logo,
          g.awayTeam.score,
          g.startTime,
          g.shortDetail,
          g.state
        ])
      }

      // Log the cleaned data for that league
      console.log(`Upserted ${cleanedData.length} games for league: ${name}.`)
    }

    // 6. Log that all leagues have been processed
    console.log('\nAll leagues processed and upserted successfully!')
  } catch (err) {
    console.error('Error occurred:', err)
  } finally {
    // 7. Close the DB connection
    await client.end()
  }
}

main()
