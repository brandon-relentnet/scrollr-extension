// financial.js
const express = require('express');
const router = express.Router();
const tradeService = require('./tradeService');

router.get('/', async (req, res) => {
    try {
        const rows = await tradeService.getTrades();
        res.json(rows);
    } catch (err) {
        console.error('Error fetching financial data:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
