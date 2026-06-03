const ApiError = require('../utils/ApiError');

/**
 * Validation middleware factory.
 * Accepts a Joi schema and returns an Express middleware that validates req.body.
 *
 * Configuration:
 *   - abortEarly: false  → collect ALL validation errors, not just the first one
 *   - allowUnknown: false → reject any fields not defined in the schema
 *   - stripUnknown: false → do not silently remove unknown fields
 *
 * On failure:
 *   Returns 400 Bad Request with all validation error messages joined as a
 *   comma-separated string.
 *
 * On success:
 *   Replaces req.body with the Joi-converted value (trimmed strings, coerced types)
 *   and calls next().
 *
 * Usage:
 *   router.post('/clubs', validate(createClubSchema), clubController.createClub);
 *
 * @param {import('joi').Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
  });

  if (error) {
    const messages = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(400, messages));
  }

  // Replace req.body with the validated and type-coerced value from Joi
  req.body = value;
  return next();
};

module.exports = validate;
