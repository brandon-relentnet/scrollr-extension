// src/components/Carousel.jsx
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import { setGames } from '../store/gamesSlice'
import EventCard from './EventCard'
import { pinEvent, unpinEvent } from '../store/pinnedEventsSlice'

export default function Carousel() {
  const dispatch = useDispatch()
  const [socket, setSocket] = useState(null)

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
    loop: true,
    speed: 600,
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
  }

  return (
    <div className="bottom-0 left-0 fixed bg-base w-full">
      {/* Pinned Row */}
      {pinnedGames.length > 0 && (
        <div className="flex flex-row bg-surface0 p-2 border-b overflow-x-auto">
          {pinnedGames.map((game) => (
            <div key={game.external_game_id} className="flex-shrink-0 w-64">
              <EventCard game={game} />
            </div>
          ))}
        </div>
      )}

      {/* Unpinned Carousel */}
      {unpinnedGames.length > 0 ? (
        <Swiper {...swiperSettings}>
          {unpinnedGames.map((game) => (
            <SwiperSlide key={game.external_game_id}>
              <EventCard game={game} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="p-4 text-center text-white">No more events to display.</p>
      )}
    </div>
  )
}
