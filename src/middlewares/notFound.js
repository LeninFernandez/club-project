const ApiError = require('../utils/ApiError');

/**
 * 404 handler for unmatched routes.
 * Must be placed after all route definitions.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
