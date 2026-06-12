const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

let io = null;

// Helper to manually parse cookies from handshake headers
const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, pair) => {
    const parts = pair.split('=');
    const key = parts[0]?.trim();
    const val = parts[1]?.trim();
    if (key && val) {
      acc[key] = decodeURIComponent(val);
    }
    return acc;
  }, {});
};

/**
 * Initializes the Socket.io server.
 * @param {object} server - The HTTP server instance.
 * @returns {object} - Initialized Socket.io server instance.
 */
const initializeSocket = (server) => {
  io = new socketIO.Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const origins = env.corsOrigins || [];
        if (origins.includes(origin) || origins.includes('*')) {
          return callback(null, true);
        }

        // Safe fallback when CLIENT_URL is missing in development mode
        if (env.NODE_ENV === 'development' && origins.length === 0) {
          return callback(null, true);
        }

        // Allow localhost loopbacks in development mode
        if (env.NODE_ENV === 'development' && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true
    }
  });


  // Authentication Middleware for socket handshakes
  io.use(async (socket, next) => {
    try {
      let token = '';

      // Source A: parse cookie from headers
      const cookieHeader = socket.handshake.headers.cookie || '';
      const cookies = parseCookies(cookieHeader);
      if (cookies.token) {
        token = cookies.token;
      }

      // Source B: fallback to auth token if supplied (useful for testing or direct connection setups)
      if (!token && socket.handshake.auth && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      }

      if (!token) {
        return next(new Error('Socket Connection Error: Authentication token missing.'));
      }

      // Verify JWT token signature
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Verify active user in DB
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return next(new Error('Socket Connection Error: User inactive or not found.'));
      }

      // Attach user object to socket session
      socket.user = user;
      next();
    } catch (error) {
      console.error(`Socket auth failure: ${error.message}`);
      return next(new Error('Socket Connection Error: Authentication signature failed.'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const role = socket.user.role;

    if (env.NODE_ENV === 'development') {
      console.log(`Socket Client Connected: User ID ${userId}, Role ${role} (Socket: ${socket.id})`);
    }

    // Join specific user and role rooms
    socket.join(`user-${userId}`);
    socket.join(`role-${role}`);

    socket.on('disconnect', () => {
      if (env.NODE_ENV === 'development') {
        console.log(`Socket Client Disconnected: Socket ID ${socket.id}`);
      }
    });
  });

  return io;
};

/**
 * Retrieves the initialized Socket.io instance.
 * @returns {object} - Socket.io server instance.
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io Error: Server is not initialized. Please call initializeSocket(server) first.');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};
