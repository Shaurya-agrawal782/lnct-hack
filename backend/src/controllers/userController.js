const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all active responders
// @route   GET /api/users/responders
// @access  Private (Admin only)
const getResponders = asyncHandler(async (req, res, next) => {
  const responders = await User.find({
    role: 'responder',
    isActive: true
  });

  res.status(200).json(
    new ApiResponse(200, { responders }, 'Responders retrieved successfully')
  );
});

module.exports = {
  getResponders
};
