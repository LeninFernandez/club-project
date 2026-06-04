const Joi = require('joi');

// ─── Reusable field definitions ────────

const nameField = Joi.string().trim().min(3).max(100).messages({
  'string.base': 'name must be a string',
  'string.empty': 'name cannot be empty',
  'string.min': 'name must be at least 3 characters',
  'string.max': 'name must not exceed 100 characters',
});

const descriptionField = Joi.string().trim().min(10).max(1000).messages({
  'string.base': 'description must be a string',
  'string.empty': 'description cannot be empty',
  'string.min': 'description must be at least 10 characters',
  'string.max': 'description must not exceed 1000 characters',
});

// ─── Create Club ───────────
// Both fields are required. Whitespace-only strings fail trim + minlength.

const createClubSchema = Joi.object({
  name: nameField.required().messages({
    'any.required': 'name is required',
  }),
  description: descriptionField.required().messages({
    'any.required': 'description is required',
  }),
});

// ─── Update Club ────────────
// Both fields are optional, but at least one must be present.
// An empty payload {} is rejected with a clear message.

const updateClubSchema = Joi.object({
  name: nameField,
  description: descriptionField,
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

module.exports = {
  createClubSchema,
  updateClubSchema,
};