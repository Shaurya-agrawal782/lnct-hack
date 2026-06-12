const mongoose = require('mongoose');

const readBySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide alert title'],
      trim: true,
      maxlength: [150, 'Alert title cannot exceed 150 characters']
    },
    message: {
      type: String,
      required: [true, 'Please provide alert message'],
      trim: true,
      maxlength: [1000, 'Alert message cannot exceed 1000 characters']
    },
    type: {
      type: String,
      required: [true, 'Please select alert type'],
      enum: ['incident_created', 'incident_assigned', 'status_updated', 'resource_updated', 'system']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    targetRoles: {
      type: [String],
      enum: ['admin', 'responder', 'citizen'],
      default: []
    },
    targetUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    relatedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    },
    relatedResource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readBy: [readBySchema]
  },
  {
    timestamps: true,
    collection: 'mern_alerts'
  }
);

// Indexes
alertSchema.index({ targetRoles: 1 });
alertSchema.index({ targetUsers: 1 });
alertSchema.index({ type: 1 });
alertSchema.index({ priority: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ relatedIncident: 1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
