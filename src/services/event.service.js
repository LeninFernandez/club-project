const mongoose = require('mongoose');
const Event = require('../models/event.model');
const Club = require('../models/club.model');
const ApiError = require('../utils/ApiError');

// Registration model resolved lazily — mongoose.model() resolves at call-time.
const getRegistrationModel = () => mongoose.model('Registration');

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }
};

const createEvent = async (data) => {
  const club = await Club.findById(data.clubId);
  if (!club) throw new ApiError(404, 'Club not found');
  return Event.create(data);
};

const getAllEvents = async () => Event.find();

const getEventById = async (id) => {
  validateObjectId(id);
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');
  return event;
};

/**
 * Update an existing event.
 *
 * Business rules beyond validator checks:
 *   - clubId is immutable — reject any payload that includes it.
 *   - endDate >= startDate is evaluated against the FINAL merged state, not just
 *     the incoming fields. This correctly handles partial updates where only one
 *     date is provided.
 */
const updateEvent = async (id, data) => {
  validateObjectId(id);

  // Service-layer backstop: validator uses .forbidden() but this catches anything that slips through.
  if ('clubId' in data) throw new ApiError(400, 'clubId cannot be modified');

  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');

  const finalStartDate = data.startDate !== undefined ? new Date(data.startDate) : event.startDate;
  const finalEndDate = data.endDate !== undefined ? new Date(data.endDate) : event.endDate;

  if (finalEndDate < finalStartDate) {
    throw new ApiError(400, 'endDate must be greater than or equal to startDate');
  }

  return Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

/**
 * Cascade delete: removes all registrations for this event, then the event itself.
 * NOT atomic — a mid-sequence crash may leave the event without registrations (V1 trade-off).
 */
const deleteEvent = async (id) => {
  validateObjectId(id);
  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, 'Event not found');

  const Registration = getRegistrationModel();
  await Registration.deleteMany({ eventId: id });
  await Event.findByIdAndDelete(id);
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
