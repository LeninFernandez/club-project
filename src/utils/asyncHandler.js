/**
 * Wraps an async Express route handler to automatically forward any
 * rejected promise or thrown error to Express's next(error) middleware.
 *
 * Eliminates repetitive try/catch blocks in every controller method.
 *
 * Usage:
 *   const createClub = asyncHandler(async (req, res) => {
 *     const club = await clubService.createClub(req.body);
 *     res.status(201).json({ success: true, message: 'Club created successfully', data: club });
 *   });
 *
 * @param {Function} fn - Async Express middleware/route handler
 * @returns {Function}  - Wrapped handler that forwards errors to next()
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
