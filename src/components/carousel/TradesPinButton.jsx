// src/components/trades/TradesPinButton.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faTimes } from '@fortawesome/free-solid-svg-icons';
import { pinTrade, unpinTrade } from '../../store/pinnedTradesSlice';

const TradesPinButton = ({ symbol }) => {
    const dispatch = useDispatch();
    const pinnedTrades = useSelector((state) => state.pinnedTrades);

    const isPinned = pinnedTrades.includes(symbol);

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(isPinned ? unpinTrade(symbol) : pinTrade(symbol));
    };

    // Use different icons (or colors) based on the state
    const icon = isPinned ? faTimes : faMapPin;
    const title = isPinned ? 'Unpin Trade' : 'Pin Trade';
    const colorClass = isPinned
        ? 'text-overlay1 hover:text-red'
        : 'text-overlay1 hover:text-accent';

    return (
        <button
            onClick={handleClick}
            className="absolute top-1 right-1 px-2 py-1 rounded text-sm cursor-pointer"
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

export default React.memo(TradesPinButton);
