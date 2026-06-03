const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: [true, 'clubId is required'],
      // immutable: true enforces that clubId cannot be changed after the document
      // is created, even if findByIdAndUpdate is called with a new clubId value.
      // The service layer also explicitly rejects such requests, but this provides
      // a second layer of protection at the schema level.
      immutable: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Event title must be at least 3 characters'],
      maxlength: [200, 'Event title must not exceed 200 characters'],
    },
    // description is intentionally optional (no `required` constraint).
    // Documented in DECISIONS.md — Event Description section.
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Event description must not exceed 2000 characters'],
      default: undefined, // prevents Mongoose from storing "" when omitted
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      minlength: [3, 'Event location must be at least 3 characters'],
      maxlength: [200, 'Event location must not exceed 200 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Event startDate is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Event endDate is required'],
    },
  },
  {
    timestamps: true, // auto-manages createdAt and updatedAt
  }
);

// Index on clubId supports:
//   - DELETE /clubs/:id  → find all events by clubId for cascade delete
//   - Future: GET /events?clubId=... (post-V1)
// Documented in API_AND_DATABASE_SPEC.md — Database Indexes — Event Collection.
eventSchema.index({ clubId: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
