// components/carousels/TradesCarousel.jsx
import React, { useEffect, useState } from 'react';
import StockCard from './StockCard';
import { io } from 'socket.io-client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function TradesCarousel({ swiperSettings }) {
    const [stockData, setStockData] = useState({});
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const newSocket = io('http://localhost:4001');
        setSocket(newSocket);

        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4001/api/financial');
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

    return (
        <div className="bg-base p-2 w-full overflow-hidden">
            <div className="flex items-center w-full h-full">
                {stocksArray.length === 0 ? (
                    <p className="text-center">No market data available...</p>
                ) : (
                    <Swiper {...swiperSettings}>
                        {stocksArray.map((item) => (
                            <SwiperSlide key={item.symbol}>
                                <StockCard symbol={item.symbol} data={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
}
