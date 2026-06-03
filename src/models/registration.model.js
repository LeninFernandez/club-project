const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'eventId is required'],
    },
    participantName: {
      type: String,
      required: [true, 'Participant name is required'],
      trim: true,
      minlength: [2, 'Participant name must be at least 2 characters'],
      maxlength: [100, 'Participant name must not exceed 100 characters'],
    },
    participantEmail: {
      type: String,
      required: [true, 'Participant email is required'],
      trim: true,
      lowercase: true, // normalise before storage so index comparison is case-insensitive
      maxlength: [254, 'Participant email must not exceed 254 characters'],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // auto-manages createdAt and updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Single-field index on eventId.
// Supports: DELETE /events/:id → deleteMany({ eventId }) for cascade delete.
// Supports: DELETE /clubs/:id  → deleteMany({ eventId: { $in: eventIds } }).
// Documented in API_AND_DATABASE_SPEC.md — Database Indexes — Registration Collection.
registrationSchema.index({ eventId: 1 });

// Unique compound index on (eventId, participantEmail).
// This is the primary enforcement mechanism for the "one registration per
// participant per event" business rule (DECISIONS.md — Duplicate Registrations).
// Enforcing at the DB level prevents race conditions that application-level
// checks cannot prevent. A duplicate key error (MongoDB code 11000) on this
// index must be caught in the service layer and returned as 409 Conflict.
registrationSchema.index(
  { eventId: 1, participantEmail: 1 },
  { unique: true }
);

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
