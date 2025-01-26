import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

function App() {
  const [games, setGames] = useState([])
  const [league, setLeague] = useState('')
  const [socket, setSocket] = useState(null)

  // Fetch function (unchanged)
  const fetchGames = async (selectedLeague) => {
    try {
      let url = 'http://localhost:4000/api/games'
      if (selectedLeague) {
        url = `http://localhost:4000/api/games/${selectedLeague}`
      }
      const response = await fetch(url)
      const data = await response.json()
      setGames(data)
    } catch (err) {
      console.error('Failed to fetch games:', err)
    }
  }

  // Socket + initial fetch
  useEffect(() => {
    const newSocket = io('http://localhost:4000')
    newSocket.on('connect', () => {
      console.log('Socket connected, ID:', newSocket.id)
    })
    newSocket.on('gamesUpdated', (payload) => {
      console.log('gamesUpdated:', payload)
      if (!league) {
        if (payload.league === 'ALL') {
          setGames(payload.games)
        } else {
          fetchGames()
        }
      } else {
        if (payload.league === league || payload.league === 'ALL') {
          setGames(payload.games)
        }
      }
    })
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchGames()
  }, [league])

  // Handle league select
  const handleLeagueChange = (e) => {
    const selected = e.target.value
    setLeague(selected)
    fetchGames(selected)
  }

  const swiperSettings = {
    modules: [ Autoplay],
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
    <div className="p-4 h-screen bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Sports Scoreboard (Swiper + Tailwind)</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by League:</label>
        <select
          className="border rounded p-1"
          value={league}
          onChange={handleLeagueChange}
        >
          <option value="">All Leagues</option>
          <option value="NFL">NFL</option>
          <option value="NBA">NBA</option>
          <option value="NHL">NHL</option>
          <option value="MLB">MLB</option>
        </select>
      </div>

      {/* The Swiper container */}
      <Swiper {...swiperSettings}>
        {/* Each game is a SwiperSlide */}
        {games.map((game) => (
          <SwiperSlide key={`${game.league}-${game.external_game_id}`}>
            <div className="border-2 bg-slate-700 border-transparent rounded-lg p-4 mx-2 my-2 text-center">
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
                {game.home_team_name} ({game.home_team_score})
                vs.
                ({game.away_team_score}) {game.away_team_name}
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

export default App
