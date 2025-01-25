import { useEffect, useState } from 'react'

function App() {
  const [games, setGames] = useState([])
  const [league, setLeague] = useState('')

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

  // On first load, fetch all games
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
