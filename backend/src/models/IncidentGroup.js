const mongoose = require('mongoose');

const incidentGroupSchema = new mongoose.Schema(
  {
    groupNumber: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
      required: true
    },
    type: {
      type: String,
      required: [true, 'Please specify the group incident type'],
      enum: ['fire', 'flood', 'medical', 'accident', 'crowd', 'rescue', 'other']
    },
    severitySummary: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['active', 'in-progress', 'resolved', 'closed'],
      default: 'active'
    },
    centerLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Please provide center coordinates [longitude, latitude]']
      }
    },
    locationSummary: {
      type: String,
      required: [true, 'Please provide a location address summary'],
      trim: true
    },
    incidentCount: {
      type: Number,
      default: 0
    },
    incidents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident'
      }
    ],
    primaryIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      required: true
    },
    firstReportedAt: {
      type: Date,
      default: Date.now
    },
    lastReportedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolutionNote: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'mern_incident_groups'
  }
);

// Geo-spatial index for coordinates search
incidentGroupSchema.index({ centerLocation: '2dsphere' });
incidentGroupSchema.index({ status: 1 });
incidentGroupSchema.index({ type: 1 });
incidentGroupSchema.index({ groupNumber: 1 });

const IncidentGroup = mongoose.model('IncidentGroup', incidentGroupSchema);

module.exports = IncidentGroup;
