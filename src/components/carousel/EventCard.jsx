// src/components/EventCard.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pinEvent, unpinEvent } from '../../store/pinnedEventsSlice'
import { removeFavoriteTeam } from '../../store/favoriteTeamsSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faTimes, faDotCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { setGames } from '../../store/gamesSlice';

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

  //console.log(game);

  // pinnedEvents is an array of IDs (external_game_id)
  const pinnedEvents = useSelector((state) => state.pinnedEvents)
  const isPinned = pinnedEvents.includes(game.external_game_id)

  const favoriteTeams = useSelector((state) => state.favoriteTeams);
  const selectedLeague = useSelector((state) => state.league);
  const favoriteTeam = favoriteTeams[selectedLeague] || null;

  // Check if the favorite team is part of this game
  const isFavoriteTeamPinned = favoriteTeam
    ? (
      game.home_team_name === favoriteTeam ||
      game.away_team_name === favoriteTeam
    )
    : false;

  const handlePinClick = (e) => {
    e.stopPropagation(); // Prevent click event from propagating to parent

    if (isFavoriteTeamPinned) {
      const confirmReset = window.confirm(
        'Are you sure you want to remove your favorite team? All related events will be unpinned.'
      );
      if (confirmReset) {
        dispatch(removeFavoriteTeam({ league: selectedLeague }));
        dispatch(unpinEvent(game.id));
      }
    } else {
      if (isPinned) {
        dispatch(unpinEvent(game.id));
      } else {
        dispatch(pinEvent(game.id));
      }
    }
  };

  console.log(isFavoriteTeamPinned);

  // Optional: open the ESPN link on card click
  const handleCardClick = () => {
    if (game.link) {
      window.open(game.link, '_blank')
    }
  }

  /*
    // Determine the icon and styling based on pinning state
    const pinIcon = isFavoriteTeamPinned ? faStar : isPinned ? faTimes : faMapPin;
    const pinClass = `text-lg transition duration-300 hover:scale-110 ${isFavoriteTeamPinned ? 'text-accent' :
        isPinned ? 'text-overlay1 hover:text-red' :
            'text-overlay1 hover:text-accent'
        }`;
*/

  return (
    <div 
      className="relative border-2 hover:border-accent bg-surface0 p-4 border-transparent rounded-lg w-auto h-[150px] text-center text-text transition duration-200"
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
