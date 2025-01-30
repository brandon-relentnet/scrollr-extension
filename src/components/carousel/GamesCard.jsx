import React from 'react';
import PinButton from './PinButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

function GamesCard({ game }) {
  // Game state checks
  const isLive = game.state.toLowerCase() === 'in';
  const isGameOver = game.state.toLowerCase() === 'final';

  // Handle card click
  const handleCardClick = () => {
    if (game?.link?.startsWith('http')) {
      window.open(game.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Score display logic
  const getWinningTeam = () => {
    if (!isGameOver) return null;
    return game.home_team_score > game.away_team_score
      ? 'home'
      : (game.away_team_score > game.home_team_score ? 'away' : null);
  };

  const winner = getWinningTeam();
  const homeScoreClass = winner === 'home' ? 'text-green' : (winner === 'away' ? 'text-red' : '');
  const awayScoreClass = winner === 'away' ? 'text-green' : (winner === 'home' ? 'text-red' : '');

  return (
    <div
      className="relative border-2 flex items-center justify-center hover:border-accent bg-surface0 cursor-pointer p-4 border-transparent rounded-lg w-auto h-[150px] text-center text-text transition duration-200"
      onClick={handleCardClick}
    >
      {isLive && (
        <div className="absolute top-1 left-1 flex text-xs items-center p-0.5">
          <FontAwesomeIcon icon={faDotCircle} className="text-red mr-1" />
          <span className="text-red font-bold">LIVE</span>
        </div>
      )}

      <PinButton
        gameId={game.external_game_id}
        league={game.league}
        homeTeam={game.home_team_name}
        awayTeam={game.away_team_name}
      />

      {/* Rest of the game card content remains the same */}
      <div className='flex justify-between items-center gap-2 w-full h-full'>
        {/* Team logos */}
        <div className="flex-1 flex items-center justify-end min-w-0 max-w-[33%] h-full">
          <img
            src={game.away_team_logo}
            alt={`${game.away_team_name} logo`}
            className="object-contain max-h-full w-auto max-w-full"
          />
        </div>

        {/* Scores */}
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

        {/* Team logos */}
        <div className="flex-1 flex items-center min-w-0 max-w-[33%] h-full">
          <img
            src={game.home_team_logo}
            alt={`${game.home_team_name} logo`}
            className="object-contain max-h-full w-auto max-w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(GamesCard);