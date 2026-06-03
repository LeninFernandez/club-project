const express = require('express');
const cors = require('cors');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS for all origins (development; tighten in production)
app.use(cors());

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server healthy',
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
// Route modules will be mounted here in later tasks.

// ─── 404 Handler ──────────────────────────────────────────────────────────────
// Must be registered after all routes so it only catches unmatched requests.
app.use(notFound);

// ─── Centralized Error Handler ────────────────────────────────────────────────
// Must be the last middleware registered. Receives errors forwarded by next(err).
app.use(errorHandler);

module.exports = app;
