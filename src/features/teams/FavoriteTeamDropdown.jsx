// src/features/teams/FavoriteTeamDropdown.jsx
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFavoriteTeam, removeFavoriteTeam } from '../../store/favoriteTeamsSlice'
import { pinEvent, unpinEvent } from '../../store/pinnedEventsSlice'
import Dropdown from '../../components/Dropdown'

/**
 * A "favorite team" dropdown that uses the new scoreboard data shape:
 *   game => { external_game_id, league, home_team_name, away_team_name, ... }
 * from Redux at state.games.
 */
const FavoriteTeamDropdown = () => {
  const dispatch = useDispatch()

  // The league currently selected (e.g., "NFL", "NBA", etc.)
  const selectedLeague = useSelector((state) => state.league)

  // The scoreboard array from Redux, each item has home/away names & scores
  const scoreboard = useSelector((state) => state.games)

  // The favoriteTeams slice: an object like { [leagueName]: "Team Name" }
  const favoriteTeams = useSelector((state) => state.favoriteTeams)
  const favoriteTeam = favoriteTeams[selectedLeague] || ''

  /**
   * Build dropdown options by collecting unique team names
   * from home_team_name / away_team_name across the scoreboard.
   */
  const teamOptions = useMemo(() => {
    if (!scoreboard) return []
    const teamSet = new Set()

    // For each game, add the home/away names to the set (if they exist)
    scoreboard.forEach((game) => {
      if (game.home_team_name) teamSet.add(game.home_team_name)
      if (game.away_team_name) teamSet.add(game.away_team_name)
    })

    // Convert set -> array -> sorted -> map to {value, label}
    const sortedTeamNames = Array.from(teamSet).sort()
    return sortedTeamNames.map((teamName) => ({
      value: teamName,
      label: teamName
    }))
  }, [scoreboard])

  /**
   * Returns the array of game IDs (external_game_id) that involve `teamName`.
   * We'll use these to pin/unpin events by ID.
   */
  const getGameIDsByTeam = (teamName) => {
    return scoreboard
      .filter((game) =>
        game.home_team_name === teamName || game.away_team_name === teamName
      )
      .map((game) => game.external_game_id)
  }

  /**
   * Called when user selects a new team from the dropdown.
   * If they select the same team again, we treat it as "unfavorite."
   */
  const handleTeamSelect = (teamName) => {
    if (teamName === favoriteTeam) {
      // user is deselecting the existing favorite
      dispatch(removeFavoriteTeam({ league: selectedLeague }))

      // unpin all games that involve that team
      const eventsToUnpin = getGameIDsByTeam(teamName)
      eventsToUnpin.forEach((eventId) => dispatch(unpinEvent(eventId)))
    } else {
      // If we had a previous favorite, unpin those
      if (favoriteTeam) {
        const oldFavoriteGames = getGameIDsByTeam(favoriteTeam)
        oldFavoriteGames.forEach((eventId) => dispatch(unpinEvent(eventId)))
      }

      // Set the new favorite
      dispatch(setFavoriteTeam({ league: selectedLeague, teamId: teamName }))

      // Pin all games that involve the new team
      const newFavoriteGames = getGameIDsByTeam(teamName)
      newFavoriteGames.forEach((eventId) => dispatch(pinEvent(eventId)))
    }
  }

  // If no league is chosen yet
  if (!selectedLeague) {
    return <p className='text-accent'>Please select a league to choose a favorite team.</p>
  }

  // If we found no teams in that league
  if (teamOptions.length === 0) {
    return <p>No teams available for the selected league.</p>
  }

  return (
    <div className="mb-4">
      <Dropdown
        options={teamOptions}
        onSelect={handleTeamSelect}
        label={
          teamOptions.find((opt) => opt.value === favoriteTeam)?.label
          || 'Select a Team'
        }
        selectedValue={favoriteTeam}
      />
    </div>
  )
}

export default FavoriteTeamDropdown
