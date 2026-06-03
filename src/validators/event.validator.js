const Joi = require('joi');

// ─── Reusable field definitions ───────────────────────────────────────────────

const titleField = Joi.string().trim().min(3).max(200).messages({
  'string.base': 'title must be a string',
  'string.empty': 'title cannot be empty',
  'string.min': 'title must be at least 3 characters',
  'string.max': 'title must not exceed 200 characters',
});

// description is optional. An empty string is treated as "not provided" and
// stripped from the validated output so Mongoose does not store an empty string.
// .empty('') converts empty string to undefined (absent key), which is safe in Joi
// without needing an explicit .default() call.
const descriptionField = Joi.string()
  .trim()
  .max(2000)
  .allow('')
  .empty('')
  .messages({
    'string.base': 'description must be a string',
    'string.max': 'description must not exceed 2000 characters',
  });

const locationField = Joi.string().trim().min(3).max(200).messages({
  'string.base': 'location must be a string',
  'string.empty': 'location cannot be empty',
  'string.min': 'location must be at least 3 characters',
  'string.max': 'location must not exceed 200 characters',
});

// Joi.date().iso() validates ISO 8601 format and coerces the string to a
// native Date object, which Mongoose then stores correctly.
// Invalid strings like "not-a-date" or "2026-13-45" are rejected.
const dateField = Joi.date().iso().messages({
  'date.base': 'must be a valid date',
  'date.format': 'must be a valid ISO 8601 date (e.g. 2026-06-08T10:00:00Z)',
});

// ─── Create Event ─────────────────────────────────────────────────────────────
// All fields except description are required.
// Date range validation (endDate >= startDate) is NOT performed here —
// that is a business rule enforced in event.service.js at runtime.

const createEventSchema = Joi.object({
  clubId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      'string.base': 'clubId must be a string',
      'string.empty': 'clubId cannot be empty',
      'string.pattern.base': 'clubId must be a valid MongoDB ObjectId',
      'any.required': 'clubId is required',
    }),

  title: titleField.required().messages({
    'any.required': 'title is required',
  }),

  description: descriptionField,

  location: locationField.required().messages({
    'any.required': 'location is required',
  }),

  startDate: dateField.required().messages({
    'any.required': 'startDate is required',
    'date.base': 'startDate must be a valid date',
    'date.format': 'startDate must be a valid ISO 8601 date (e.g. 2026-06-08T10:00:00Z)',
  }),

  endDate: dateField.required().messages({
    'any.required': 'endDate is required',
    'date.base': 'endDate must be a valid date',
    'date.format': 'endDate must be a valid ISO 8601 date (e.g. 2026-06-08T10:00:00Z)',
  }),
});

// ─── Update Event ─────────────────────────────────────────────────────────────
// All mutable fields are optional, but at least one must be provided.
//
// clubId is explicitly FORBIDDEN with a clear error message.
// Using .forbidden() produces "clubId cannot be modified" rather than the
// generic "clubId is not allowed" that allowUnknown: false would produce,
// making the intent unambiguous to the client.
//
// Date range validation (endDate >= startDate against final merged state)
// is NOT performed here — that is enforced in event.service.js.

const updateEventSchema = Joi.object({
  clubId: Joi.any().forbidden().messages({
    'any.unknown': 'clubId cannot be modified',
  }),

  title: titleField,

  description: descriptionField,

  location: locationField,

  startDate: dateField.messages({
    'date.base': 'startDate must be a valid date',
    'date.format': 'startDate must be a valid ISO 8601 date (e.g. 2026-06-08T10:00:00Z)',
  }),

  endDate: dateField.messages({
    'date.base': 'endDate must be a valid date',
    'date.format': 'endDate must be a valid ISO 8601 date (e.g. 2026-06-08T10:00:00Z)',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

module.exports = {
  createEventSchema,
  updateEventSchema,
};
