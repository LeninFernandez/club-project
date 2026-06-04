const mongoose = require('mongoose');
const env = require('./env');

/**
 * Establishes the Mongoose connection to MongoDB.
 * Called once at application startup in server.js.
 */
const connectDB = async () => {
  const conn = await mongoose.connect(env.MONGODB_URI);
  console.log(`[db] MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
