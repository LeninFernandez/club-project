/**
 * Custom error class for operational (expected) application errors.
 *
 * Usage:
 *   throw new ApiError(404, 'Club not found');
 *   throw new ApiError(409, 'Club name already exists');
 *
 * The centralized error handler checks `isOperational` to distinguish
 * business errors from unexpected programming errors.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 409)
   * @param {string} message    - Human-readable error message returned to the client
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintain proper stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

module.exports = ApiError;
