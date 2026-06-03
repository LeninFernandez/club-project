const mongoose = require('mongoose');
const Event = require('../models/event.model');
const Club = require('../models/club.model');
const ApiError = require('../utils/ApiError');

// Registration model resolved lazily to avoid circular dependency issues
// and because it does not exist until Task 11.
// Mongoose resolves model('Registration') at call-time, not at import-time.
const getRegistrationModel = () => mongoose.model('Registration');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validates that `id` is a well-formed MongoDB ObjectId.
 * Throws 400 before any DB query is attempted.
 *
 * @param {string} id
 */
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }
};

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Create a new event.
 * Verifies the referenced club exists before inserting the event document.
 *
 * @param {object} data - Validated request body (from createEventSchema)
 * @returns {Promise<Event>} The newly created event document
 * @throws {ApiError} 404 if the referenced club does not exist
 */
const createEvent = async (data) => {
  const club = await Club.findById(data.clubId);
  if (!club) {
    throw new ApiError(404, 'Club not found');
  }

  const event = await Event.create(data);
  return event;
};

/**
 * Retrieve all events.
 *
 * @returns {Promise<Event[]>} Array of all event documents (may be empty)
 */
const getAllEvents = async () => {
  const events = await Event.find();
  return events;
};

/**
 * Retrieve a single event by its MongoDB ObjectId.
 *
 * @param {string} id - Event _id
 * @returns {Promise<Event>} The matching event document
 * @throws {ApiError} 400 if id is not a valid ObjectId
 * @throws {ApiError} 404 if no event found with that id
 */
const getEventById = async (id) => {
  validateObjectId(id);

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }
  return event;
};

/**
 * Update an existing event.
 *
 * Business rules enforced here (beyond what the validator checks):
 *   1. clubId immutability — reject any payload that includes clubId
 *   2. Date range — evaluate endDate >= startDate against the FINAL merged
 *      state of the document, not just the incoming payload fields.
 *      This handles partial updates correctly:
 *        - Only startDate updated → compare new startDate vs existing endDate
 *        - Only endDate updated   → compare existing startDate vs new endDate
 *        - Both updated           → compare both new values
 *
 * @param {string} id   - Event _id
 * @param {object} data - Validated partial update body (from updateEventSchema)
 * @returns {Promise<Event>} The updated event document
 * @throws {ApiError} 400 if id is invalid, clubId included, or date range violated
 * @throws {ApiError} 404 if event not found
 */
const updateEvent = async (id, data) => {
  validateObjectId(id);

  // Guard: reject clubId even if it somehow passes the validator.
  // The validator uses .forbidden() but this provides a service-layer backstop.
  if ('clubId' in data) {
    throw new ApiError(400, 'clubId cannot be modified');
  }

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Determine the final startDate and endDate after merging the update.
  // Use incoming value if provided, otherwise fall back to the stored value.
  const finalStartDate = data.startDate !== undefined
    ? new Date(data.startDate)
    : event.startDate;

  const finalEndDate = data.endDate !== undefined
    ? new Date(data.endDate)
    : event.endDate;

  // Enforce date range business rule on the merged final state.
  if (finalEndDate < finalStartDate) {
    throw new ApiError(400, 'endDate must be greater than or equal to startDate');
  }

  // Apply the update. { new: true } returns the updated document.
  // { runValidators: true } runs schema-level validators (minlength, maxlength, etc.).
  const updatedEvent = await Event.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return updatedEvent;
};

/**
 * Delete an event and cascade-delete all related registrations.
 *
 * Deletion order (leaf-nodes first):
 *   1. Verify event exists
 *   2. Delete all Registration documents where eventId === id
 *   3. Delete the Event document
 *
 * NOTE: This operation is NOT atomic (no transactions in V1).
 * A crash between steps 2 and 3 would leave the event document without
 * registrations. This is a documented V1 trade-off.
 *
 * @param {string} id - Event _id
 * @returns {Promise<void>}
 * @throws {ApiError} 400 if id is not a valid ObjectId
 * @throws {ApiError} 404 if no event found with that id
 */
const deleteEvent = async (id) => {
  validateObjectId(id);

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const Registration = getRegistrationModel();

  // Step 1: Delete all registrations for this event
  await Registration.deleteMany({ eventId: id });

  // Step 2: Delete the event itself
  await Event.findByIdAndDelete(id);
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
