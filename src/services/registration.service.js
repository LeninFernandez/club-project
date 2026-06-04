const mongoose = require('mongoose');
const Registration = require('../models/registration.model');
const Event = require('../models/event.model');
const ApiError = require('../utils/ApiError');

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }
};

/**
 * Inserts a registration. The unique compound index on (eventId, participantEmail)
 * enforces the one-registration-per-participant rule at the DB level.
 * Error code 11000 is mapped to 409 to handle race conditions that bypass the
 * event existence check.
 */
const createRegistration = async (data) => {
  const event = await Event.findById(data.eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  try {
    return await Registration.create(data);
  } catch (err) {
    if (err.code === 11000) throw new ApiError(409, 'You are already registered for this event');
    throw err;
  }
};

const getAllRegistrations = async () => Registration.find();

const getRegistrationsByEvent = async (eventId) => {
  validateObjectId(eventId);
  return Registration.find({ eventId });
};

const deleteRegistration = async (id) => {
  validateObjectId(id);
  const registration = await Registration.findById(id);
  if (!registration) throw new ApiError(404, 'Registration not found');
  await Registration.findByIdAndDelete(id);
};

module.exports = { createRegistration, getAllRegistrations, getRegistrationsByEvent, deleteRegistration };
