import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { setGames } from '../store/gamesSlice'
import EventCard from './EventCard'

const breakpointsArray = {};
const startBreakpoint = 0;
const endBreakpoint = 8000;
const breakpointStep = 320;

for (let i = startBreakpoint; i <= endBreakpoint; i += breakpointStep) {
    breakpointsArray[i] = {
        slidesPerView: Math.floor(i / 320),
    };
}

console.log('Breakpoints:', breakpointsArray)

export default function Carousel() {
    const dispatch = useDispatch()
    const [socket, setSocket] = useState(null)
    const [visibleSlides, setVisibleSlides] = useState(0)

    // Redux data
    const selectedLeague = useSelector((state) => state.league)
    const games = useSelector((state) => state.games)
    const pinnedEvents = useSelector((state) => state.pinnedEvents) // array of external_game_ids

    // fetch logic
    const fetchGames = async (league) => {
        try {
            let url = 'http://localhost:4000/api/games'
            if (league) {
                url = `http://localhost:4000/api/games/${league}`
            }
            const response = await fetch(url)
            const data = await response.json()
            dispatch(setGames(data))
        } catch (err) {
            console.error('Failed to fetch games:', err)
        }
    }

    // socket init
    useEffect(() => {
        const newSocket = io('http://localhost:4000')
        newSocket.on('connect', () => {
            console.log('Socket connected, ID:', newSocket.id)
        })

        newSocket.on('gamesUpdated', (payload) => {
            console.log('gamesUpdated:', payload)
            if (!selectedLeague) {
                if (payload.league === 'ALL') {
                    dispatch(setGames(payload.games))
                } else {
                    fetchGames()
                }
            } else {
                if (payload.league === selectedLeague || payload.league === 'ALL') {
                    dispatch(setGames(payload.games))
                }
            }
        })

        setSocket(newSocket)
        return () => {
            newSocket.disconnect()
        }
        // eslint-disable-next-line
    }, [])

    // re-fetch if league changes
    useEffect(() => {
        fetchGames(selectedLeague)
    }, [selectedLeague])

    // Separate pinned vs. unpinned
    const pinnedGames = games.filter((g) => pinnedEvents.includes(g.external_game_id))
    const unpinnedGames = games.filter((g) => !pinnedEvents.includes(g.external_game_id))

    const swiperSettings = {
        modules: [Autoplay],
        autoplay: { delay: 3000, disableOnInteraction: false },
        breakpointsBase: 'container',
        loop: true,
        speed: 600,
        spaceBetween: 8,
        breakpoints: breakpointsArray,
        watchSlidesProgress: true,
        onSlideChange: (swiper) => {
            // Update visible slides count based on slidesPerView
            const slidesPerView = swiper.params.slidesPerView
            setVisibleSlides(slidesPerView)
        },
        onInit: (swiper) => {
            // Initialize visible slides count
            const slidesPerView = swiper.params.slidesPerView
            setVisibleSlides(slidesPerView)
        },
    }

    return (
        <>
            {/* Display the visible slides count */}
            <div className="absolute bottom-48 right-2 bg-overlay0 text-text p-2 rounded">
                Visible Slides: {visibleSlides}
            </div>
            <div className="bottom-0 left-0 z-50 fixed flex bg-base p-2 w-full overflow-hidden">
                <div className="flex items-center w-full h-full">
                    {/* Pinned Events Section */}
                    {pinnedGames.length > 0 && (
                        <div className="flex flex-shrink-0 rounded h-full overflow-hidden">
                            {pinnedGames.map((game) => (
                                <div key={game.external_game_id} className="mr-2" style={{
                                    width: '400px',
                                    height: '150px',
                                }}>
                                    <EventCard game={game} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Unpinned Carousel */}
                    <div className="flex-grow h-full overflow-hidden">
                        {unpinnedGames.length > 0 ? (
                            <Swiper {...swiperSettings}>
                                {unpinnedGames.map((game) => (
                                    <SwiperSlide key={game.external_game_id}>
                                        {({ isVisible }) => (
                                            <EventCard game={game} isVisible={isVisible} />
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <p className="p-4 text-center text-white">No more events to display.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}