const express = require('express');
const cors = require('cors');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const clubRoutes = require('./routes/club.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registration.routes');

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

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/clubs', clubRoutes);
app.use('/events', eventRoutes);
app.use('/registrations', registrationRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
// Registered after all routes — catches any request that did not match above.
app.use(notFound);

// ─── Centralized Error Handler ────────────────────────────────────────────────
// Must be the LAST middleware. Receives errors forwarded by next(err) from
// anywhere in the stack (controllers, services via asyncHandler, notFound).
app.use(errorHandler);

module.exports = app;
