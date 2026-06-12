const mongoose = require('mongoose');
const Resource = require('../models/Resource');
const User = require('../models/User');
const env = require('../config/env');

const seedResources = async () => {
  try {
    console.log('Connecting to database for resource seeding...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Database connected.');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@disasterconnect.dev' });
    if (!adminUser) {
      console.error('Error: Admin user (admin@disasterconnect.dev) not found. Please run seed:users first.');
      process.exit(1);
    }

    const resources = [
      {
        name: 'Bhopal Central Ambulance 01',
        type: 'ambulance',
        status: 'available',
        capacity: 2,
        currentLocation: {
          type: 'Point',
          coordinates: [77.3956, 23.2599], // [longitude, latitude]
          address: 'Hamidia Hospital, Bhopal'
        },
        contactPerson: 'Dr. Suresh Sharma',
        contactNumber: '+91 98765 43210',
        description: 'Primary critical care transport unit stationed at Hamidia Hospital.',
        createdBy: adminUser._id
      },
      {
        name: 'Fire Response Unit 01',
        type: 'fire_truck',
        status: 'available',
        capacity: 5,
        currentLocation: {
          type: 'Point',
          coordinates: [77.4302, 23.2337],
          address: 'MP Nagar, Bhopal'
        },
        contactPerson: 'Chief Inspector Amit Kumar',
        contactNumber: '+91 98765 43211',
        description: 'Standard chemical/fire suppression engine with active crew.',
        createdBy: adminUser._id
      },
      {
        name: 'Rescue Team Alpha',
        type: 'rescue_team',
        status: 'available',
        capacity: 8,
        currentLocation: {
          type: 'Point',
          coordinates: [77.4010, 23.2315],
          address: 'TT Nagar, Bhopal'
        },
        contactPerson: 'Commander Rajesh Singh',
        contactNumber: '+91 98765 43212',
        description: 'Disaster response team trained for search, rescue, and flood extractions.',
        createdBy: adminUser._id
      },
      {
        name: 'Emergency Shelter 01',
        type: 'shelter',
        status: 'available',
        capacity: 100,
        currentLocation: {
          type: 'Point',
          coordinates: [77.4563, 23.2322],
          address: 'BHEL, Bhopal'
        },
        contactPerson: 'Manager Vinay Gupte',
        contactNumber: '+91 98765 43213',
        description: 'Community relief shelter with food, water, and first aid provisions.',
        createdBy: adminUser._id
      }
    ];

    // Seed resources
    for (const rData of resources) {
      const existingResource = await Resource.findOne({ name: rData.name });

      if (!existingResource) {
        const newResource = await Resource.create(rData);
        console.log(`Seeded resource: "${newResource.name}"`);
      } else {
        // Update to make sure it matches seed details
        existingResource.type = rData.type;
        existingResource.status = rData.status;
        existingResource.capacity = rData.capacity;
        existingResource.currentLocation = rData.currentLocation;
        existingResource.contactPerson = rData.contactPerson;
        existingResource.contactNumber = rData.contactNumber;
        existingResource.description = rData.description;
        await existingResource.save();
        console.log(`Resource already exists, updated/verified: "${rData.name}"`);
      }
    }

    console.log('Resource seeding completed successfully!');
  } catch (error) {
    console.error(`Error seeding resources: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

seedResources();
