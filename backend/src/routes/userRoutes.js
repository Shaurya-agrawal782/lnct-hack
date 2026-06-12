const express = require('express');
const { getResponders } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /api/users/responders (Admin only)
router.get('/responders', protect, authorizeRoles('admin'), getResponders);

module.exports = router;
