import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { pinEvent, unpinEvent } from '../../store/pinnedEventsSlice';
import { removeFavoriteTeam } from '../../store/favoriteTeamsSlice';

const GamesPinButton = ({ gameId, league, homeTeam, awayTeam }) => {
    const dispatch = useDispatch();

    // Get state from Redux
    const pinnedEvents = useSelector((state) => state.pinnedEvents);
    const favoriteTeam = useSelector((state) => state.favoriteTeams[league]);

    // Derived state
    const isPinned = pinnedEvents.includes(gameId);
    const isFavoriteTeam = favoriteTeam === homeTeam || favoriteTeam === awayTeam;
    const isFavoriteTeamPinned = isPinned && isFavoriteTeam;

    const handleClick = (e) => {
        e.stopPropagation();

        if (isFavoriteTeamPinned) {
            const confirmReset = window.confirm(
                'Are you sure you want to remove your favorite team? All related events will be unpinned.'
            );
            if (confirmReset) {
                dispatch(removeFavoriteTeam({ league }));
                dispatch(unpinEvent(gameId));
            }
        } else {
            dispatch(isPinned ? unpinEvent(gameId) : pinEvent(gameId));
        }
    };

    const icon = isFavoriteTeamPinned ? faStar : isPinned ? faTimes : faMapPin;
    const title = isFavoriteTeamPinned
        ? 'Reset Favorite Team'
        : (isPinned ? 'Unpin Event' : 'Pin Event');

    const colorClass = isFavoriteTeamPinned
        ? 'text-accent'
        : isPinned
            ? 'text-overlay1 hover:text-red'
            : 'text-overlay1 hover:text-accent';

    return (
        <button
            onClick={handleClick}
            className="top-1 right-1 absolute px-2 py-1 rounded text-sm cursor-pointer"
            title={title}
            aria-label={title}
        >
            <FontAwesomeIcon
                icon={icon}
                className={`text-lg transition duration-300 hover:scale-110 ${colorClass}`}
            />
        </button>
    );
};

export default React.memo(GamesPinButton);