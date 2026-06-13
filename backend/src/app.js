const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const env = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const userRoutes = require('./routes/userRoutes');
const incidentGroupRoutes = require('./routes/incidentGroupRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const alertRoutes = require('./routes/alertRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Standard middlewares
app.use(express.json());
app.use(cookieParser());

// Morgan logger for development environment
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS middleware supporting multiple origins and development fallbacks
const corsOptions = {
  origin: function (origin, callback) {
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
};

app.use(cors(corsOptions));


// Route mounts
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incident-groups', incidentGroupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// 404 Route Not Found interceptor
app.use(notFound);

// Central error handler
app.use(errorHandler);

module.exports = app;
