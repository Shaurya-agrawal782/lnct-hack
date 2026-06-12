const express = require('express');
const {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  updateResourceStatus,
  deleteResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Get list and create endpoints
router.route('/')
  .post(protect, authorizeRoles('admin'), createResource)
  .get(protect, authorizeRoles('admin', 'responder'), getResources);

// Detail operations, status operations, and delete endpoints
router.route('/:id')
  .get(protect, authorizeRoles('admin', 'responder'), getResourceById)
  .patch(protect, authorizeRoles('admin'), updateResource)
  .delete(protect, authorizeRoles('admin'), deleteResource);

router.route('/:id/status')
  .patch(protect, authorizeRoles('admin'), updateResourceStatus);

module.exports = router;
