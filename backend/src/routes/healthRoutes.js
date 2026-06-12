const express = require('express');
const mongoose = require('mongoose');
const env = require('../config/env');

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbStatus = dbStates[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    success: true,
    message: "DisasterConnect API is running",
    environment: env.NODE_ENV,
    database: dbStatus
  });
});

module.exports = router;
