import React from 'react';
import TradesPinButton from './TradesPinButton';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const TradesCard = ({ symbol, data }) => {
    const isDataComplete = data && typeof data.price === 'number';

    // Safe number formatting
    const formatNumber = (value, fallback = 'N/A') => {
        if (typeof value !== 'number') return fallback;
        return value.toFixed(2);
    };

    if (!isDataComplete) {
        return (
            <div className="p-4 min-w-60 bg-surface0 rounded shadow border-2 border-surface0 hover:border-accent hover:shadow-lg transition duration-300 relative h-full">
                <h2 className='text-xl font-bold'>{symbol}</h2>
                <p className='text-lg'>Loading data...</p>
            </div>
        );
    }

    const {
        price,
        previous_close: previousClose,
        price_change: priceChange,
        percentage_change: percentageChange,
        direction
    } = data;

    // Determine arrow and color based on direction
    let ArrowIcon;
    let changeColor;

    switch (direction) {
        case 'up':
            ArrowIcon = FaArrowUp;
            changeColor = 'text-green';
            break;
        case 'down':
            ArrowIcon = FaArrowDown;
            changeColor = 'text-red';
            break;
        default:
            ArrowIcon = FaMinus;
            changeColor = 'text-overlay0';
    }

    const yahooFinanceUrl = `https://finance.yahoo.com/quote/${symbol}`;

    // Handle card click
    const handleCardClick = () => {
        window.open(yahooFinanceUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className='relative border-2 flex items-center justify-center hover:border-accent bg-surface0 cursor-pointer p-4 border-transparent rounded-lg w-auto h-[150px] text-center text-text transition duration-200'
            onClick={handleCardClick}
        >
            <TradesPinButton symbol={symbol} />

            <div className='flex justify-evenly items-center w-full h-full'>
                <div className='flex flex-col items-start justify-center'>
                    <h2 className='text-xl font-bold'>{symbol}</h2>
                    <p className="text-2xl font-mono">${formatNumber(price)}</p>
                </div>

                <div className={`flex flex-col items-end justify-center`}>
                    <div className={`flex items-center ${changeColor}`}>
                        <ArrowIcon className="mr-1" />
                        <span className='text-sm'>
                            {formatNumber(priceChange)} ({formatNumber(percentageChange)}%)
                        </span>
                    </div>
                    {previousClose && (
                        <div className="text-xs text-overlay0 mt-1">
                            Prev Close: ${formatNumber(previousClose)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TradesCard;