// server.js
const { httpServer, setupBroadcast, setupGracefulShutdown, finnhubWS } = require('./app');
const PORT = process.env.PORT || 4001;

httpServer.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await finnhubWS.start();
    setupBroadcast();
    console.log(
        'WebSocket status:',
        finnhubWS.socket && finnhubWS.socket.readyState === 1 ? 'Connected' : 'Disconnected'
    );
});

setupGracefulShutdown(httpServer);
