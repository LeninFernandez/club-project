// env.js imported first 
// and dotenv.config() validates required environment variables 
const env = require('./config/env');

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./app');

// ─── Start Server ─────────────────────────────────────────────────────────────

const startServer = async () => {
  // Connect to MongoDB before accepting any HTTP traffic.
  // connectDB() throws on failure, which propagates here and exits the process.
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[server] Running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────────────

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      console.log('[server] HTTP server closed.');

      try {
        await mongoose.connection.close();
        console.log('[db] MongoDB connection closed.');
      } catch (err) {
        console.error('[db] Error closing MongoDB connection:', err.message);
      }

      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[server] Failed to start:', err.message);
  process.exit(1);
});
