const IncidentGroup = require('../models/IncidentGroup');
const Incident = require('../models/Incident');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const createAlertAndEmit = require('../utils/createAlert');

// @desc    Get all incident groups (Admin only)
// @route   GET /api/incident-groups
// @access  Private (Admin only)
const getIncidentGroups = asyncHandler(async (req, res, next) => {
  const { status, type, search } = req.query;

  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  if (search) {
    query.$or = [
      { groupNumber: { $regex: search, $options: 'i' } },
      { locationSummary: { $regex: search, $options: 'i' } }
    ];
  }

  const groups = await IncidentGroup.find(query)
    .sort('-createdAt')
    .populate('primaryIncident', 'title severity status');

  res.status(200).json(
    new ApiResponse(200, { groups }, 'Incident groups retrieved successfully')
  );
});

// @desc    Get incident group details by ID (Admin only)
// @route   GET /api/incident-groups/:id
// @access  Private (Admin only)
const getIncidentGroupById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const group = await IncidentGroup.findById(id)
    .populate('primaryIncident', 'title ticketNumber severity status description location')
    .populate({
      path: 'incidents',
      select: 'ticketNumber title severity status location createdAt reportedBy'
    });

  if (!group) {
    return next(new AppError(404, 'Incident group not found'));
  }

  res.status(200).json(
    new ApiResponse(200, { group }, 'Incident group details retrieved successfully')
  );
});

// @desc    Update incident group status / Resolve group (Admin only)
// @route   PATCH /api/incident-groups/:id/status
// @access  Private (Admin only)
const updateGroupStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, resolutionNote } = req.body;

  if (!status) {
    return next(new AppError(400, 'Please specify group status.'));
  }

  const group = await IncidentGroup.findById(id);
  if (!group) {
    return next(new AppError(404, 'Incident group not found.'));
  }

  group.status = status;

  if (status === 'resolved' || status === 'closed') {
    group.resolvedAt = new Date();
    group.resolvedBy = req.user._id;
    group.resolutionNote = resolutionNote || '';

    // Find all unresolved incidents linked to this group
    const unresolvedIncidents = await Incident.find({
      _id: { $in: group.incidents },
      status: { $nin: ['resolved', 'closed'] }
    });

    const io = req.app.get('io');

    for (const incident of unresolvedIncidents) {
      incident.status = status;
      
      // Append status history
      if (!incident.statusHistory) {
        incident.statusHistory = [];
      }
      incident.statusHistory.push({
        status: status,
        changedBy: req.user._id,
        note: resolutionNote || `Incident resolved as part of group ${group.groupNumber} resolution.`
      });

      await incident.save();

      // Create and emit safety alert to the individual citizen reporter
      try {
        await createAlertAndEmit({
          io,
          title: `Report ticket marked ${status}`,
          message: `Your report ticket ${incident.ticketNumber} linked to group ${group.groupNumber} has been marked ${status}. Note: ${resolutionNote || 'No resolution note provided.'}`,
          type: 'status_updated',
          priority: 'medium',
          targetUsers: [incident.reportedBy],
          relatedIncident: incident._id,
          createdBy: req.user._id
        });
      } catch (alertErr) {
        console.error(`Failed to create alert for citizen reporter of incident ${incident.ticketNumber}:`, alertErr.message);
      }
    }
  }

  await group.save();

  res.status(200).json(
    new ApiResponse(200, { group }, `Incident group marked as ${status} successfully.`)
  );
});

module.exports = {
  getIncidentGroups,
  getIncidentGroupById,
  updateGroupStatus
};
