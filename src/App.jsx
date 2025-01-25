import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [games, setGames] = useState([])
  const [league, setLeague] = useState('')
  const [socket, setSocket] = useState(null)

  // Function to fetch all games or specific league
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

  // On first load, set up Socket.IO and fetch initial games
  useEffect(() => {
    // 1) Connect to the Socket.IO server
    const newSocket = io('http://localhost:4000', {
      // if you need specific transports or config: e.g. transports: ['websocket'],
    })

    // 2) Listen for socket connection
    newSocket.on('connect', () => {
      console.log('Connected to server via Socket.IO, socket ID:', newSocket.id)
    })

    // 3) Listen for 'gamesUpdated' events from the server
    newSocket.on('gamesUpdated', (payload) => {
      console.log('Received gamesUpdated event:', payload)

      // payload might be { league: 'NBA', games: [...] } or { league: 'ALL', games: [...] }
      // We can decide how we want to handle it based on user’s current league filter

      if (!league) {
        // If user is viewing "All Leagues," replace with the new data
        if (payload.league === 'ALL') {
          // if server sends 'ALL', directly set
          setGames(payload.games)
        } else {
          // server sends a single league update (e.g. "NBA"),
          // but we want to show everything => we can do a fresh fetch or merge
          // Easiest approach: do a fresh fetch so we always have up-to-date data
          fetchGames()
        }
      } else {
        // The user has selected a specific league
        // If the server’s payload.league matches our user’s selection, update
        if (payload.league === league || payload.league === 'ALL') {
          setGames(payload.games)
        } else {
          // It's an update for a different league. If we want to ignore it, do nothing
          // Or you could still fetch league data to ensure all changes are up to date
        }
      }
    })

    // 4) Cleanup on unmount (disconnect socket)
    setSocket(newSocket)
    return () => {
      newSocket.disconnect()
    }
    // eslint-disable-next-line
  }, []) // run once on mount

  // On mount also do initial fetch of "All" leagues
  useEffect(() => {
    fetchGames()
  }, [])

  // Handler for league select
  const handleLeagueChange = (e) => {
    const selected = e.target.value
    setLeague(selected)

    if (!selected) {
      // if "All" is selected
      fetchGames()
    } else {
      fetchGames(selected)
    }
  }

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Sports Scoreboard</h1>

      <div>
        <label>Filter by League: </label>
        <select value={league} onChange={handleLeagueChange}>
          <option value="">All Leagues</option>
          <option value="NFL">NFL</option>
          <option value="NBA">NBA</option>
          <option value="NHL">NHL</option>
          <option value="MLB">MLB</option>
        </select>
      </div>

      <table style={{ marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>League</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Home Team</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Home Score</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Away Team</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Away Score</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Start Time</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>State</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={`${game.league}-${game.external_game_id}`}>
              <td style={{ border: '1px solid black', padding: '4px' }}>{game.league}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{game.home_team_name}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{game.home_team_score}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{game.away_team_name}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{game.away_team_score}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {new Date(game.start_time).toLocaleString()}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{game.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
