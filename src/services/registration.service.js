const mongoose = require('mongoose');
const Registration = require('../models/registration.model');
const Event = require('../models/event.model');
const ApiError = require('../utils/ApiError');

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
 * Register a participant for an event.
 *
 * Steps:
 *   1. Verify the referenced event exists
 *   2. Insert Registration document
 *   3. Handle MongoDB duplicate key error (11000) from the unique compound
 *      index on (eventId, participantEmail) → 409 Conflict
 *
 * @param {object} data - Validated request body (from createRegistrationSchema)
 * @returns {Promise<Registration>} The newly created registration document
 * @throws {ApiError} 404 if the referenced event does not exist
 * @throws {ApiError} 409 if participant is already registered for this event
 */
const createRegistration = async (data) => {
  const event = await Event.findById(data.eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  try {
    const registration = await Registration.create(data);
    return registration;
  } catch (err) {
    // Unique compound index (eventId, participantEmail) violation.
    // This handles the race condition where two simultaneous requests
    // both pass the event existence check and attempt to insert.
    if (err.code === 11000) {
      throw new ApiError(409, 'You are already registered for this event');
    }
    throw err;
  }
};

/**
 * Retrieve all registrations for a specific event.
 *
 * @param {string} eventId - Event _id
 * @returns {Promise<Registration[]>} Array of registration documents (may be empty)
 * @throws {ApiError} 400 if eventId is not a valid ObjectId
 */
const getRegistrationsByEvent = async (eventId) => {
  validateObjectId(eventId);

  const registrations = await Registration.find({ eventId });
  return registrations;
};

/**
 * Cancel (delete) a registration by its MongoDB ObjectId.
 *
 * @param {string} id - Registration _id
 * @returns {Promise<void>}
 * @throws {ApiError} 400 if id is not a valid ObjectId
 * @throws {ApiError} 404 if no registration found with that id
 */
const deleteRegistration = async (id) => {
  validateObjectId(id);

  const registration = await Registration.findById(id);
  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  await Registration.findByIdAndDelete(id);
};

module.exports = {
  createRegistration,
  getRegistrationsByEvent,
  deleteRegistration,
};
