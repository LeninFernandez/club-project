const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Centralized Express error handling middleware.
 * Must be registered as the LAST middleware in app.js.
 *
 * Handles:
 *   - ApiError              
 *   - Mongoose CastError  
 *   - Mongoose ValidationError
 *   - MongoDB duplicate key (11000) 
 *   - All other errors     
 *
 * All responses follow the documented error format:
 *   { success: false, message: "..." }
 *
 * Stack traces are hidden in production to avoid leaking internals.
 */

const errorHandler = (err, req, res, next) => {
  // ── Operational errors thrown via ApiError ──────────────────────────────────
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ── Mongoose CastError (invalid ObjectId format) ─────────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // ── Mongoose ValidationError (schema-level field validation) ─────────────────
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // ── MongoDB duplicate key error ───────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value for unique field: ${field}`,
    });
  }

  // ── Unexpected / programming errors ──────────────────────────────────────────
  // Log the full error internally but never expose stack traces to the client
  console.error('[errorHandler] Unexpected error:', err);

  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
};

module.exports = errorHandler;
