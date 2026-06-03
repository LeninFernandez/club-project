const dotenv = require('dotenv');

// Load .env file — this is the ONLY place dotenv.config() is called in the entire application
dotenv.config();

const REQUIRED_VARS = ['MONGODB_URI'];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`[env] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[env] Create a .env file based on .env.example and set all required variables.');
  process.exit(1);
}

const env = Object.freeze({
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
});

module.exports = env;
