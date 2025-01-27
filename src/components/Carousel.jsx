import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { setGames } from '../store/gamesSlice'

export default function Carousel() {
  const dispatch = useDispatch()
  const [socket, setSocket] = useState(null)

  // Retrieve data from Redux
  const selectedLeague = useSelector((state) => state.league)
  const games = useSelector((state) => state.games) // array from gamesSlice

  // 1) Helper function to fetch games (calls Redux dispatch)
  const fetchGames = async (league) => {
    try {
      let url = 'http://localhost:4000/api/games'
      if (league) {
        url = `http://localhost:4000/api/games/${league}`
      }
      const response = await fetch(url)
      const data = await response.json()
      // store in Redux
      dispatch(setGames(data))
    } catch (err) {
      console.error('Failed to fetch games:', err)
    }
  }

  // 2) Socket initialization
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

  // 3) Fetch games whenever the league changes
  useEffect(() => {
    fetchGames(selectedLeague)
  }, [selectedLeague]) // re-fetch if league changes

  // 4) Swiper settings
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
    <div className='bottom-0 left-0 fixed w-full'>
      <Swiper {...swiperSettings}>
        {games.map((game) => (
          <SwiperSlide key={`${game.league}-${game.external_game_id}`}>
            <div className="border-2 bg-rosewater mx-2 my-2 p-4 border-transparent rounded-lg text-center">
              <h2 className="mb-1 font-semibold text-xl">{game.league}</h2>
              <a
                href={game.link}
                target="_blank"
                rel="noreferrer"
                className="block mb-2 text-blue-500 underline"
              >
                ESPN Link
              </a>
              <p className="font-medium">
                {game.away_team_name} ({game.away_team_score})
                vs.
                ({game.home_team_score}) {game.home_team_name}
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                Time: {game.short_detail}
              </p>
              <p className="text-gray-600 text-sm">
                State: {game.state}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
