const pool = require('./db');

const excludedStates = `('post', 'completed', 'final')`;

async function getTimeInfo() {
  const query = `
    SELECT 
      CURRENT_DATE AT TIME ZONE 'UTC' AS currentDay,
      (CURRENT_DATE AT TIME ZONE 'UTC' + INTERVAL '1 day') AS nextDay
  `;

  const result = await pool.query(query);

  // Extract and format the time info
  const timeInfo = {
    currentDay: result.rows[0].currentday.toISOString(),
    nextDay: result.rows[0].nextday.toISOString(),
  };

  console.log('TIME INFO', timeInfo);
  return timeInfo;
}

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
          state            = EXCLUDED.state;
  `;

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
  ];

  await pool.query(upsertQuery, values);
}

/**
 * Returns all "not-final" games scheduled for TODAY (UTC-based).
 * 1. Start Time >= today (00:06:00 UTC)
 * 2. Start Time < tomorrow (00:06:00 UTC)
 */
async function getNotFinalGamesToday() {
  // Wait for getTimeInfo to complete and get the time info
  const timeInfo = await getTimeInfo();

  // Dynamically construct the query using timeInfo
  const query = `
    SELECT *
    FROM games
    WHERE
      start_time >= '${timeInfo.currentDay}'
      AND start_time < '${timeInfo.nextDay}'
      AND state NOT IN ${excludedStates}
    ORDER BY start_time ASC;
  `;

  console.log('SQL Query:', query);

  const result = await pool.query(query);
  console.log('getNotFinalGamesToday:', result.rows);
  return result.rows; // Directly return the rows
}

/**
 * Checks if all games for a given league are final today.
 */
async function areAllGamesFinal(league) {
  const query = `
    SELECT COUNT(*) AS cnt
    FROM games
    WHERE league = $1
      AND DATE(start_time::timestamp AT TIME ZONE 'UTC') = CURRENT_DATE
      AND state NOT IN ('post', 'completed', 'final');
  `;

  const res = await pool.query(query, [league]);
  const countNonFinal = parseInt(res.rows[0].cnt, 10);
  return countNonFinal === 0; // If countNonFinal is 0, no non-final games remain
}

/**
 * Returns all games from the "games" table.
 */
async function getAllGames() {
  const query = `
    SELECT *
    FROM games
    ORDER BY 
      CASE WHEN state = 'in' THEN 1 ELSE 2 END ASC,
      league ASC, 
      start_time::timestamp ASC, 
      external_game_id ASC;
  `;

  const result = await pool.query(query);
  return result.rows; // Return all games ordered by the criteria
}

/**
 * Returns all games for a given league.
 */
async function getGamesByLeague(leagueName) {
  const query = `
    SELECT *
    FROM games
    WHERE league = $1
    ORDER BY start_time::timestamp ASC;
  `;

  const result = await pool.query(query, [leagueName]);
  return result.rows; // Return games for the specified league
}

module.exports = {
  upsertGame,
  getNotFinalGamesToday,
  areAllGamesFinal,
  getAllGames,
  getGamesByLeague,
};
