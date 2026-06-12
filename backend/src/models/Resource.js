const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a resource name'],
      trim: true,
      maxlength: [120, 'Resource name cannot exceed 120 characters']
    },
    type: {
      type: String,
      required: [true, 'Please select a resource type'],
      enum: ['ambulance', 'fire_truck', 'rescue_team', 'medical', 'shelter', 'supply', 'volunteer_group', 'other']
    },
    status: {
      type: String,
      enum: ['available', 'assigned', 'busy', 'maintenance', 'offline'],
      default: 'available'
    },
    capacity: {
      type: Number,
      default: 1,
      min: [0, 'Capacity cannot be less than 0']
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Please provide location coordinates [longitude, latitude]']
      },
      address: {
        type: String,
        required: [true, 'Please provide a location address'],
        trim: true
      }
    },
    contactPerson: {
      type: String,
      trim: true
    },
    contactNumber: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    assignedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'mern_resources'
  }
);

// Indexes
resourceSchema.index({ currentLocation: '2dsphere' });
resourceSchema.index({ type: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ assignedIncident: 1 });
resourceSchema.index({ createdBy: 1 });
resourceSchema.index({ createdAt: -1 });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
