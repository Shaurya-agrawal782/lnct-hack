const dotenv = require('dotenv');
const path = require('path');

// Load env variables from root of backend directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/disasterconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'replace_with_strong_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  ALLOW_PUBLIC_ROLE_REGISTRATION: process.env.ALLOW_PUBLIC_ROLE_REGISTRATION === 'true'
};

module.exports = env;
