// dbQueries.js is a module that contains database queries for interacting with the "games" table in the database. It exports functions for upserting a game record, fetching not-final games scheduled for today, and checking if all games for a given league are final today.
const pool = require('./db')

/**
 * Upsert a single game record into the "games" table.
 */
async function upsertGame(game) {
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
  `

    const values = [
        game.league,
        game.externalGameId,
        game.link,
        game.homeTeam.name,
        game.homeTeam.logo,
        game.homeTeam.score,
        game.awayTeam.name,
        game.awayTeam.logo,
        game.awayTeam.score,
        game.startTime,
        game.shortDetail,
        game.state,
    ]

    await pool.query(upsertQuery, values)
}

/**
 * Returns all "not-final" games scheduled for TODAY (UTC-based).
 */
async function getNotFinalGamesToday() {
    const query = `
    SELECT *
    FROM games
    WHERE
      DATE(start_time AT TIME ZONE 'UTC') = CURRENT_DATE AT TIME ZONE 'UTC'
      AND state NOT IN ('post', 'completed', 'final')
    ORDER BY start_time ASC
  `
    const result = await pool.query(query)
    return result.rows
}

/**
 * Checks if all games for a given league are final today.
 */
async function areAllGamesFinal(league) {
    const query = `
    SELECT COUNT(*) AS cnt
    FROM games
    WHERE league = $1
      AND DATE(start_time AT TIME ZONE 'UTC') = CURRENT_DATE AT TIME ZONE 'UTC'
      AND state NOT IN ('post', 'completed', 'final')
  `
    const res = await pool.query(query, [league])
    const countNonFinal = parseInt(res.rows[0].cnt, 10)
    // If countNonFinal is 0, no non-final games remain
    return (countNonFinal === 0)
}

module.exports = {
    upsertGame,
    getNotFinalGamesToday,
    areAllGamesFinal,
}
