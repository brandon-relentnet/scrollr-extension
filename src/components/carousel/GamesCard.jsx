// src/components/EventCard.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pinEvent, unpinEvent } from '../../store/pinnedEventsSlice'
import { removeFavoriteTeam } from '../../store/favoriteTeamsSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faTimes, faDotCircle, faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * Renders a single "game" in the scoreboard shape:
 *   {
 *     external_game_id,
 *     league,
 *     home_team_name,
 *     home_team_logo,
 *     home_team_score,
 *     away_team_name,
 *     away_team_logo,
 *     away_team_score,
 *     link,
 *     short_detail,
 *     state,
 *     ...
 *   }
 */
export default function GamesCard({ game }) {
  const dispatch = useDispatch()

  // Check game state to determine styling
  const isLive = game.state.toLowerCase() === 'in';
  const isGameOver = game.state.toLowerCase() === 'final';

  // pinnedEvents is an array of IDs (external_game_id)
  const pinnedEvents = useSelector((state) => state.pinnedEvents)
  const isPinned = pinnedEvents.includes(game.external_game_id)

  // check if favorite game is pinned
  const favoriteTeams = useSelector((state) => state.favoriteTeams);
  const favoriteTeamName = favoriteTeams[game.league];
  const isFavoriteTeamPinned = isPinned && (
    favoriteTeamName === game.home_team_name ||
    favoriteTeamName === game.away_team_name
  );

  // Toggle pinned state when user clicks
  const handlePinClick = (e) => {
    e.stopPropagation()
    if (isFavoriteTeamPinned) {
      const confirmReset = window.confirm('Are you sure you want to remove your favorite team? All related events will be unpinned.');
      if (confirmReset) {
        dispatch(removeFavoriteTeam({ league: game.league }));
        dispatch(unpinEvent(game.external_game_id))
      }
    } else {
      if (isPinned) {
        dispatch(unpinEvent(game.external_game_id))
      } else {
        dispatch(pinEvent(game.external_game_id))
      }
    }
  }

  // Optional: open the ESPN link on card click
  const handleCardClick = () => {
    if (game.link) {
      window.open(game.link, '_blank')
    }
  }

  // Determine the icon and styling based on pinning state
  const pinIcon = isFavoriteTeamPinned ? faStar : isPinned ? faTimes : faMapPin;
  const pinClass = `text-lg transition duration-300 hover:scale-110 ${isFavoriteTeamPinned ? 'text-accent' :
    isPinned ? 'text-overlay1 hover:text-red' :
      'text-overlay1 hover:text-accent'
    }`;

  let homeScoreClass = '';
  let awayScoreClass = '';

  if (isGameOver) {
    if (game.home_team_score > game.away_team_score) {
      homeScoreClass = 'text-green';
      awayScoreClass = 'text-red';
    } else if (game.away_team_score > game.home_team_score) {
      awayScoreClass = 'text-green';
      homeScoreClass = 'text-red';
    }
  }

  return (
    <div
      className="relative border-2 flex items-center justify-center hover:border-accent bg-surface0 cursor-pointer p-4 border-transparent rounded-lg w-auto h-[150px] text-center text-text transition duration-200"
      onClick={handleCardClick}
    >
      {/* LIVE Indicator */}
      {isLive && (
        <div className="absolute top-1 left-1 flex text-xs items-center p-0.5">
          <FontAwesomeIcon icon={faDotCircle} className="text-red mr-1" />
          <span className="text-red font-bold">LIVE</span>
        </div>
      )}

      {/* PIN BUTTON */}
      <button
        onClick={handlePinClick}
        className="top-1 right-1 absolute px-2 py-1 rounded text-sm cursor-pointer"
        title={isFavoriteTeamPinned ? 'Reset Favorite Team' : (isPinned ? 'Unpin Event' : 'Pin Event')}
      >
        <FontAwesomeIcon icon={pinIcon} className={pinClass} />
      </button>

      {/* GAME INFO */}
      <div className='flex justify-between items-center gap-2 w-full h-full'>
        {/* TEAM LOGOS */}
        <div className="flex-1 flex items-center justify-end min-w-0 max-w-[33%] h-full">
          <img
            src={game.away_team_logo}
            alt={`${game.away_team_name} logo`}
            className="object-contain max-h-full w-auto max-w-full"
          />
        </div>

        {/* SCORES AND DETAILS */}
        <div className="flex-shrink-0 mx-2 min-w-[100px]">
          <div className="flex items-center font-bold text-text justify-center">
            <span className={`text-xl ${awayScoreClass}`}>{game.away_team_score}</span>
            <span className="mx-1">-</span>
            <span className={`text-xl ${homeScoreClass}`}>{game.home_team_score}</span>
          </div>
          <p className="text-xs text-subtext0 text-center break-words mt-1">
            {game.short_detail}
          </p>
        </div>

        {/* TEAM LOGOS */}
        <div className="flex-1 flex items-center min-w-0 max-w-[33%] h-full">
          <img
            src={game.home_team_logo}
            alt={`${game.home_team_name} logo`}
            className="object-contain max-h-full w-auto max-w-full"
          />
        </div>
      </div>
    </div>
  )
}
