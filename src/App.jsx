import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Carousel from './components/Carousel'
import { Autoplay } from 'swiper/modules'
import Popup from './components/Popup'

export default function App() {
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
  }, [])

  // Handle league select
  const handleLeagueChange = (e) => {
    const selected = e.target.value
    setLeague(selected)
    fetchGames(selected)
  }

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
    <div className="h-screen bg-base">
      <Popup league={league} handleLeagueChange={handleLeagueChange} />
      <Carousel games={games} swiperSettings={swiperSettings} />
    </div>
  )
}