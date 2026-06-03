const Joi = require('joi');

// ─── Reusable field definitions ───────────────────────────────────────────────

// ObjectId pattern: exactly 24 hexadecimal characters.
// Used for eventId validation — same pattern used in event.validator.js for clubId.
const objectIdField = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .messages({
    'string.base': 'eventId must be a string',
    'string.empty': 'eventId cannot be empty',
    'string.pattern.base': 'eventId must be a valid MongoDB ObjectId',
  });

const participantNameField = Joi.string().trim().min(2).max(100).messages({
  'string.base': 'participantName must be a string',
  'string.empty': 'participantName cannot be empty',
  'string.min': 'participantName must be at least 2 characters',
  'string.max': 'participantName must not exceed 100 characters',
});

// participantEmail is lowercased by Joi before validation so that
// "Jane@Example.com" and "jane@example.com" are treated identically,
// consistent with the lowercase: true setting on the Mongoose schema.
// Max 254 chars follows RFC 5321 maximum email address length.
const participantEmailField = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } }) // allow: false avoids requiring a TLD list
  .max(254)
  .messages({
    'string.base': 'participantEmail must be a string',
    'string.empty': 'participantEmail cannot be empty',
    'string.email': 'participantEmail must be a valid email address',
    'string.max': 'participantEmail must not exceed 254 characters',
  });

// ─── Create Registration ──────────────────────────────────────────────────────
// All three fields are required.
// Duplicate registration prevention is NOT performed here —
// that is a business rule enforced by the unique compound index and
// caught in registration.service.js (error code 11000 → 409 Conflict).

const createRegistrationSchema = Joi.object({
  eventId: objectIdField.required().messages({
    'any.required': 'eventId is required',
  }),

  participantName: participantNameField.required().messages({
    'any.required': 'participantName is required',
  }),

  participantEmail: participantEmailField.required().messages({
    'any.required': 'participantEmail is required',
  }),
});

// ─── Update Registration ──────────────────────────────────────────────────────
// All fields optional, but at least one must be provided.
// NOTE: There is no PUT /registrations/:id endpoint in the API specification.
// This schema is defined here for completeness as instructed, but it is not
// wired to any route in Version 1.

const updateRegistrationSchema = Joi.object({
  eventId: objectIdField,
  participantName: participantNameField,
  participantEmail: participantEmailField,
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

module.exports = {
  createRegistrationSchema,
  updateRegistrationSchema,
};
