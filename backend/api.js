// api.js
const express = require('express')
const cors = require('cors')
const { getAllGames, getGamesByLeague } = require('./dbQueries')

/**
 * startApiServer(port):
 *   1) Creates and configures an Express app
 *   2) Defines your API routes
 *   3) Listens on the specified port
 *   4) Returns a promise that resolves when the server is up
 */
function startApiServer(port = 4000) {
    const app = express()
    app.use(cors())
    app.use(express.json())

    // Define API routes
    app.get('/api/games', async (req, res) => {
        try {
            const games = await getAllGames()
            res.json(games)
        } catch (err) {
            console.error('Error fetching all games:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    app.get('/api/games/:league', async (req, res) => {
        try {
            const leagueName = req.params.league
            const games = await getGamesByLeague(leagueName)
            res.json(games)
        } catch (err) {
            console.error('Error fetching league games:', err)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    // Return a promise so we can "await" the server start in server.js
    return new Promise((resolve, reject) => {
        app.listen(port, () => {
            console.log(`\n🚀 Express API running on http://localhost:${port}`)
            resolve()  // Resolved when server is up
        }).on('error', (err) => {
            reject(err) // In case listening fails
        })
    })
}

module.exports = { startApiServer }
