const Alert = require('../models/Alert');

/**
 * Creates a persistent alert record in database and emits it in real-time to Socket.io client rooms.
 * @param {object} params - Parameters object.
 * @param {object} [params.io] - Socket.io server instance.
 * @param {string} params.title - Alert Title.
 * @param {string} params.message - Detailed alert message.
 * @param {string} params.type - Alert type enum.
 * @param {string} [params.priority] - Severity level enum.
 * @param {string[]} [params.targetRoles] - List of target roles.
 * @param {string[]} [params.targetUsers] - List of target user IDs.
 * @param {string} [params.relatedIncident] - Related Incident ID.
 * @param {string} [params.relatedResource] - Related Resource ID.
 * @param {string} [params.createdBy] - Creator user ID.
 * @returns {Promise<object>} - Saved Mongoose Alert document.
 */
const createAlertAndEmit = async ({
  io,
  title,
  message,
  type,
  priority = 'medium',
  targetRoles = [],
  targetUsers = [],
  relatedIncident,
  relatedResource,
  createdBy
}) => {
  try {
    // 1. Create alert record
    let alert = await Alert.create({
      title,
      message,
      type,
      priority,
      targetRoles,
      targetUsers,
      relatedIncident,
      relatedResource,
      createdBy
    });

    // 2. Populate references for rich frontend details
    alert = await Alert.findById(alert._id)
      .populate('createdBy', 'name email')
      .populate('relatedIncident', 'title status')
      .populate('relatedResource', 'name type');

    // 3. Emit real-time WebSocket notification to matching client rooms
    if (io) {
      // Send to role rooms (role-admin, role-responder, role-citizen)
      if (Array.isArray(targetRoles) && targetRoles.length > 0) {
        targetRoles.forEach(role => {
          io.to(`role-${role}`).emit('alert:new', alert);
        });
      }

      // Send to user-specific rooms (user-userId)
      if (Array.isArray(targetUsers) && targetUsers.length > 0) {
        targetUsers.forEach(userId => {
          io.to(`user-${userId.toString()}`).emit('alert:new', alert);
        });
      }
    }

    return alert;
  } catch (error) {
    console.error(`Alerting error: Failed to save or emit alert: ${error.message}`);
    // Return null or re-throw as appropriate. Returning the error state allows caller handling.
    throw error;
  }
};

module.exports = createAlertAndEmit;
