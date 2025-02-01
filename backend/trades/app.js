// app.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// Import your new trades route
const tradesRoutes = require('./trades');
const finnhubWS = require('./finnhubWebSocket');
const tradeService = require('./tradeService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount the trades route so endpoints start with /api/trades
app.use('/api/trades', tradesRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' },
});

// Setup socket connections
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    tradeService.getTrades()
        .then(rows => socket.emit('financialUpdate', rows))
        .catch(err => console.error('Initial data error:', err));

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Broadcast updates throttled by a timeout
function setupBroadcast() {
    let broadcastTimeout = null;
    if (finnhubWS.socket) {
        finnhubWS.socket.on('message', async () => {
            if (broadcastTimeout) return;
            broadcastTimeout = setTimeout(async () => {
                broadcastTimeout = null;
                try {
                    const rows = await tradeService.getTrades();
                    io.emit('financialUpdate', rows);
                } catch (err) {
                    console.error('Broadcast error:', err);
                }
            }, 1000);
        });
    } else {
        console.warn('Warning: finnhubWS.socket not established yet!');
    }
}

// Graceful shutdown handler
function setupGracefulShutdown(httpServer) {
    process.on('SIGINT', () => {
        console.log('Shutting down gracefully...');
        finnhubWS.disconnect();
        finnhubWS.stopCronJobs();

        httpServer.close(() => {
            console.log('HTTP Server closed');
            process.exit(0);
        });

        // Force shutdown if not closed in time
        setTimeout(() => {
            console.error('Forcing shutdown...');
            process.exit(0);
        }, 5000);
    });
}

module.exports = {
    httpServer,
    setupBroadcast,
    setupGracefulShutdown,
    finnhubWS,
};
