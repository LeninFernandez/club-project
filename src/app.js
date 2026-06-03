const express = require('express');
const cors = require('cors');

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
// Routes will be mounted here in later tasks.

// ─── Error Handling ───────────────────────────────────────────────────────────
// Error handler middleware will be registered here in later tasks.

module.exports = app;
