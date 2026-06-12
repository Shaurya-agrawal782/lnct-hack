const express = require('express');
const {
  getSummary,
  getIncidentStats,
  getResourceStats,
  getAlertStats,
  getDashboardOverview
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/incidents', protect, getIncidentStats);
router.get('/resources', protect, getResourceStats);
router.get('/alerts', protect, getAlertStats);
router.get('/dashboard', protect, getDashboardOverview);

module.exports = router;
