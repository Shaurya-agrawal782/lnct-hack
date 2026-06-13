const express = require('express');
const { 
  getIncidentGroups, 
  getIncidentGroupById, 
  updateGroupStatus 
} = require('../controllers/incidentGroupController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Restrict all grouped incident routes to authenticated administrators
router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getIncidentGroups);

router.route('/:id')
  .get(getIncidentGroupById);

router.route('/:id/status')
  .patch(updateGroupStatus);

module.exports = router;
