const mongoose = require('mongoose');
const Incident = require('../models/Incident');
const IncidentGroup = require('../models/IncidentGroup');
const env = require('../config/env');
const { assignIncidentToGroup } = require('../services/incidentGroupingService');

const backfillGroups = async () => {
  try {
    console.log('Connecting to database for incident groups backfill...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Database connected.');

    // Clear any empty or malformed groups first (if testing)
    // Find incidents without incidentGroup
    const incidents = await Incident.find({
      $or: [
        { incidentGroup: { $exists: false } },
        { incidentGroup: null }
      ]
    }).sort({ createdAt: 1 }); // Process chronologically

    console.log(`Found ${incidents.length} incidents to process for smart grouping.`);

    let processedCount = 0;
    for (const incident of incidents) {
      await assignIncidentToGroup(incident);
      processedCount++;
    }

    // Output final results
    const totalGroups = await IncidentGroup.countDocuments();
    console.log(`Backfill completed. Processed ${processedCount} incidents into groups.`);
    console.log(`Total Incident Groups in database: ${totalGroups}`);

  } catch (error) {
    console.error(`Error during incident groups backfill: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

backfillGroups();
