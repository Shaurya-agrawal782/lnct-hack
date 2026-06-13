const express = require('express');
const { analyzeReportDraft } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/report-assist', protect, authorizeRoles('admin', 'citizen'), analyzeReportDraft);

module.exports = router;
