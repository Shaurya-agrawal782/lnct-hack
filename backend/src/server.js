const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

let server;

// Start the database connection first, then start the express server
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Express app listener
    server = app.listen(env.PORT, () => {
      console.log(`====================================================`);
      console.log(`DisasterConnect server is running in [${env.NODE_ENV}] mode`);
      console.log(`Server Listening Port: ${env.PORT}`);
      console.log(`Local Access URL: http://localhost:${env.PORT}`);
      console.log(`====================================================`);
    });

    // 3. Graceful shutdown handler
    const gracefulShutdown = (signal) => {
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
      
      if (server) {
        server.close(() => {
          console.log('HTTP server closed.');
          
          // Close mongoose connection
          const mongoose = require('mongoose');
          mongoose.connection.close(false).then(() => {
            console.log('MongoDB connection closed.');
            process.exit(0);
          });
        });
      } else {
        process.exit(0);
      }
    };

    // Listen for shutdown signals
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error(`Startup Error: Failed to bootstrap the server - ${error.message}`);
    process.exit(1);
  }
};

// Bootstrap the system
startServer();
