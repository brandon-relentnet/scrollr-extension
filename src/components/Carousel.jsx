import { React, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client'

import 'swiper/css'

export default function Carousel() {
    const [games, setGames] = useState([])
    const [socket, setSocket] = useState(null)
    
    const selectedLeague = useSelector((state) => state.league);

    console.log('Selected league:', selectedLeague);

    // Fetch function
    const fetchGames = async (league) => {
        try {
            let url = 'http://localhost:4000/api/games';
            if (league) {
                url = `http://localhost:4000/api/games/${league}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setGames(data);
        } catch (err) {
            console.error('Failed to fetch games:', err);
        }
    };

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        newSocket.on('connect', () => {
            console.log('Socket connected, ID:', newSocket.id);
        });
        newSocket.on('gamesUpdated', (payload) => {
            console.log('gamesUpdated:', payload);
            if (!selectedLeague) {
                if (payload.league === 'ALL') {
                    setGames(payload.games);
                } else {
                    fetchGames();
                }
            } else {
                if (payload.league === selectedLeague || payload.league === 'ALL') {
                    setGames(payload.games);
                }
            }
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchGames(selectedLeague);
    }, [selectedLeague]);

    const swiperSettings = {
        modules: [Autoplay],
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        loop: true,
        speed: 600,
        breakpoints: {
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
        },
    }

    return (
        <div className='fixed bottom-0 left-0 w-full'>
            {/* The Swiper container */}
            <Swiper {...swiperSettings}>
                {/* Each game is a SwiperSlide */}
                {games.map((game) => (
                    <SwiperSlide key={`${game.league}-${game.external_game_id}`}>
                        <div className="border-2 bg-rosewater border-transparent rounded-lg p-4 mx-2 my-2 text-center">
                            <h2 className="text-xl font-semibold mb-1">{game.league}</h2>
                            <a
                                href={game.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 underline mb-2 block"
                            >
                                ESPN Link
                            </a>
                            <p className="font-medium">
                                {game.away_team_name} ({game.away_team_score})
                                vs.
                                ({game.home_team_score}) {game.home_team_name}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Time: {game.short_detail}
                            </p>
                            <p className="text-sm text-gray-600">
                                State: {game.state}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

    )
}
