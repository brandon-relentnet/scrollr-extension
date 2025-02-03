// src/components/carousels/TradesCarousel.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from 'react-redux';
import TradesCard from './TradesCard';

export default function TradesCarousel({ swiperSettings }) {
    const [stockData, setStockData] = useState({});
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get pinned trades from Redux
    const pinnedTrades = useSelector((state) => state.pinnedTrades);

    // Fetch initial data
    useEffect(() => {
        const newSocket = io(`${import.meta.env.VITE_SOCKET_TRADES}`);
        setSocket(newSocket);

        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_TRADES_API}`);
                const data = await response.json();

                const formattedData = data.reduce((acc, item) => ({
                    ...acc,
                    [item.symbol]: {
                        ...item,
                        price: Number(item.price),
                        previous_close: Number(item.previous_close),
                        price_change: Number(item.price_change),
                        percentage_change: Number(item.percentage_change),
                    },
                }), {});
                setStockData(formattedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();

        return () => newSocket.disconnect();
    }, []);

    // Listen for socket updates
    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (data) => {
            const formattedData = data.reduce((acc, item) => ({
                ...acc,
                [item.symbol]: {
                    ...item,
                    price: Number(item.price),
                    previous_close: Number(item.previous_close),
                    price_change: Number(item.price_change),
                    percentage_change: Number(item.percentage_change),
                },
            }), {});
            setStockData(formattedData);
        };

        socket.on('financialUpdate', handleUpdate);
        return () => socket.off('financialUpdate', handleUpdate);
    }, [socket]);

    if (loading) return <div className="text-center">Loading market data...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

    const stocksArray = Object.values(stockData);

    // Separate pinned vs. unpinned trades
    const pinnedStocks = stocksArray.filter(item => pinnedTrades.includes(item.symbol));
    const unpinnedStocks = stocksArray.filter(item => !pinnedTrades.includes(item.symbol));

    return (
        <div className="bg-base p-2 w-full overflow-hidden">
            <div className="flex items-center w-full h-full">
                {/* Pinned Trades Section */}
                {pinnedStocks.length > 0 && (
                    <div className="flex flex-shrink-0 rounded h-full overflow-hidden">
                        {pinnedStocks.map((item) => (
                            <div
                                key={item.symbol}
                                className="mr-2"
                                style={{ width: '400px', height: '150px' }}
                            >
                                <TradesCard symbol={item.symbol} data={item} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Unpinned Carousel */}
                <div className="flex-grow h-full overflow-hidden">
                    {unpinnedStocks.length > 0 ? (
                        <Swiper {...swiperSettings}>
                            {unpinnedStocks.map((item) => (
                                <SwiperSlide key={item.symbol}>
                                    <TradesCard symbol={item.symbol} data={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <p className="p-4 text-center text-white">No market data available...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
