const express = require('express');
const {
  getMyAlerts,
  markAlertRead,
  markAllAlertsRead
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get list and mark all read
router.get('/', protect, getMyAlerts);
router.patch('/read-all', protect, markAllAlertsRead);

// Mark specific alert read
router.patch('/:id/read', protect, markAlertRead);

module.exports = router;
