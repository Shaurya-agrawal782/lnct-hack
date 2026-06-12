const env = require('../config/env');
const AppError = require('../utils/AppError');

// Middleware to handle 404 Route Not Found
const notFound = (req, res, next) => {
  const error = new AppError(404, `Route not found - ${req.originalUrl}`);
  next(error);
};

// Central Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFound,
  errorHandler
};
