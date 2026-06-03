const ApiError = require('../utils/ApiError');

/**
 * Catch-all 404 middleware.
 * Registered after all routes in app.js.
 *
 * Any request that reaches this middleware did not match any defined route.
 * Forwards a 404 ApiError to the centralized error handler.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
