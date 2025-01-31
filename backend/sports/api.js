// api.js is the API server for the backend. It uses Express and Socket.IO to serve data and broadcast updates to clients.
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const { getAllGames, getGamesByLeague } = require('./dbQueries')

let io = null  // We'll store a reference to the Socket.IO server

/**
 * startApiServer(port):
 *   1) Creates and configures an Express app
 *   2) Defines your API routes
 *   3) Creates an HTTP server and attaches Socket.IO
 *   4) Listens on the specified port
 *   5) Returns a promise that resolves when the server is up
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

    // Create an HTTP server from Express
    const httpServer = http.createServer(app)

    // Attach Socket.IO to this server
    io = new Server(httpServer, {
        cors: {
            origin: '*',  // or specify your frontend domain
        },
    })

    // Optional: Listen for new connections
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`)

        // If you want, you can handle client events here, e.g.:
        // socket.on('subscribeToLeague', league => { ... })
    })

    // Start listening on the chosen port
    return new Promise((resolve, reject) => {
        httpServer.listen(port, () => {
            console.log(`\n🚀 Express + Socket.IO running on http://localhost:${port}`)
            resolve()
        }).on('error', (err) => {
            reject(err)
        })
    })
}

/**
 * broadcastUpdatedGames(optionalLeague):
 *   Use this function to emit a 'gamesUpdated' event with fresh data.
 *   If optionalLeague is provided, you can fetch only that league's data, etc.
 */
async function broadcastUpdatedGames(optionalLeague) {
    if (!io) return  // If Socket.IO isn't set up yet, do nothing

    try {
        let data = []
        if (optionalLeague) {
            data = await getGamesByLeague(optionalLeague)
            io.emit('gamesUpdated', { league: optionalLeague, games: data })
        } else {
            // If no league specified, get ALL games
            data = await getAllGames()
            io.emit('gamesUpdated', { league: 'ALL', games: data })
        }
    } catch (err) {
        console.error('Error broadcasting updated games:', err)
    }
}

module.exports = {
    startApiServer,
    broadcastUpdatedGames
}