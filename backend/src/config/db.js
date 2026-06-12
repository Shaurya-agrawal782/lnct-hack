const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    // Set up connection listeners before initiating connection
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connection event: Connected to database');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection event error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection event: Disconnected from database');
    });

    // Establish Mongoose connection
    const conn = await mongoose.connect(env.MONGODB_URI);
    
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
