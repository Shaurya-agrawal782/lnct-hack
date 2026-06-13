const IncidentGroup = require('../models/IncidentGroup');
const Incident = require('../models/Incident');
const generateGroupNumber = require('../utils/generateGroupNumber');

const RADIUS_METERS = 300;
const TIME_WINDOW_MS = 3 * 60 * 60 * 1000; // 3 hours

const SEVERITY_RANKS = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

/**
 * Assigns an incident to an existing active group or creates a new group.
 * @param {object} incident - Mongoose Incident document.
 * @returns {Promise<void>}
 */
const assignIncidentToGroup = async (incident) => {
  // Check if incident has valid coordinates
  if (
    !incident.location || 
    !incident.location.coordinates || 
    incident.location.coordinates.length < 2 ||
    incident.location.coordinates[0] === null ||
    incident.location.coordinates[1] === null
  ) {
    console.log(`Incident ${incident.ticketNumber} has invalid coordinates. Skipping grouping.`);
    return;
  }

  const coordinates = incident.location.coordinates; // [longitude, latitude]

  try {
    // 1. Search for existing active or in-progress group matching:
    // - Same type
    // - Status not in resolved/closed
    // - Created or updated within the last 3 hours
    // - Location within 300 meters
    const existingGroup = await IncidentGroup.findOne({
      type: incident.type,
      status: { $nin: ['resolved', 'closed'] },
      lastReportedAt: { $gte: new Date(Date.now() - TIME_WINDOW_MS) },
      centerLocation: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: RADIUS_METERS
        }
      }
    });

    if (existingGroup) {
      console.log(`Linking incident ${incident.ticketNumber} to group ${existingGroup.groupNumber}`);
      
      // Prevent double linking if already linked
      if (!existingGroup.incidents.includes(incident._id)) {
        existingGroup.incidents.push(incident._id);
        existingGroup.incidentCount = existingGroup.incidents.length;

        // Recalculate centerLocation average dynamically
        const oldC = existingGroup.incidentCount - 1;
        const newC = existingGroup.incidentCount;
        if (oldC > 0) {
          const oldLong = existingGroup.centerLocation.coordinates[0];
          const oldLat = existingGroup.centerLocation.coordinates[1];
          const newLong = coordinates[0];
          const newLat = coordinates[1];

          existingGroup.centerLocation.coordinates = [
            (oldLong * oldC + newLong) / newC,
            (oldLat * oldC + newLat) / newC
          ];
        }
      }

      existingGroup.lastReportedAt = new Date();

      // Recalculate severitySummary (highest of both)
      const currentRank = SEVERITY_RANKS[existingGroup.severitySummary] || 0;
      const newRank = SEVERITY_RANKS[incident.severity] || 0;
      if (newRank > currentRank) {
        existingGroup.severitySummary = incident.severity;
      }

      await existingGroup.save();

      // Update incident reference
      incident.incidentGroup = existingGroup._id;
      await incident.save();

    } else {
      // 2. Create new IncidentGroup
      console.log(`No matching group found. Creating new group for incident ${incident.ticketNumber}`);
      
      let groupNumber = generateGroupNumber();
      let groupExists = await IncidentGroup.findOne({ groupNumber });
      let retries = 0;
      
      while (groupExists && retries < 5) {
        groupNumber = generateGroupNumber();
        groupExists = await IncidentGroup.findOne({ groupNumber });
        retries++;
      }

      const group = await IncidentGroup.create({
        groupNumber,
        type: incident.type,
        severitySummary: incident.severity,
        status: 'active',
        centerLocation: {
          type: 'Point',
          coordinates: coordinates
        },
        locationSummary: incident.location.address,
        incidentCount: 1,
        incidents: [incident._id],
        primaryIncident: incident._id,
        firstReportedAt: incident.createdAt || new Date(),
        lastReportedAt: incident.createdAt || new Date()
      });

      // Update incident reference
      incident.incidentGroup = group._id;
      await incident.save();
    }
  } catch (err) {
    console.error(`Error in assignIncidentToGroup: ${err.message}`);
    throw err; // throw so caller can catch/log
  }
};

module.exports = {
  assignIncidentToGroup
};
