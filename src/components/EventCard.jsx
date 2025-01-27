// src/components/EventCard.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pinEvent, unpinEvent } from '../store/pinnedEventsSlice'

/**
 * Renders a single "game" in the scoreboard shape:
 *   {
 *     external_game_id,
 *     league,
 *     home_team_name,
 *     home_team_score,
 *     away_team_name,
 *     away_team_score,
 *     link,
 *     short_detail,
 *     state,
 *     ...
 *   }
 */
export default function EventCard({ game }) {
  const dispatch = useDispatch()

  // pinnedEvents is an array of IDs (external_game_id)
  const pinnedEvents = useSelector((state) => state.pinnedEvents)
  const isPinned = pinnedEvents.includes(game.external_game_id)

  // Toggle pinned state when user clicks
  const handlePinClick = (e) => {
    e.stopPropagation() // avoid any container onClick if needed
    if (isPinned) {
      dispatch(unpinEvent(game.external_game_id))
    } else {
      dispatch(pinEvent(game.external_game_id))
    }
  }

  // Optional: open the ESPN link on card click
  const handleCardClick = () => {
    if (game.link) {
      window.open(game.link, '_blank')
    }
  }

  return (
    <div 
      className="relative border-2 hover:border-accent bg-surface0 mx-2 my-2 p-4 border-transparent rounded-lg text-center text-text transition duration-200"
      onClick={handleCardClick}
    >
      {/* PIN BUTTON */}
      <button
        onClick={handlePinClick}
        className="top-1 right-1 absolute bg-overlay0 px-2 py-1 rounded text-sm"
      >
        {isPinned ? 'Unpin' : 'Pin'}
      </button>

      <h2 className="mb-1 font-semibold text-xl">{game.league}</h2>
      <p className="font-medium">
        {game.away_team_name} ({game.away_team_score}) 
        vs. 
        ({game.home_team_score}) {game.home_team_name}
      </p>
      <p className="mt-2 text-gray-600 text-sm">
        Time: {game.short_detail}
      </p>
      <p className="text-gray-600 text-sm">
        State: {game.state}
      </p>
    </div>
  )
}
