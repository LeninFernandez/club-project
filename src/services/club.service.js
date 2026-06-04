const mongoose = require('mongoose');
const Club = require('../models/club.model');
const ApiError = require('../utils/ApiError');

// Event and Registration models are resolved lazily to avoid circular dependencies.
// mongoose.model() resolves at call-time, so these are safe before those models register.
const getEventModel = () => mongoose.model('Event');
const getRegistrationModel = () => mongoose.model('Registration');

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid ID format');
  }
};

const createClub = async (data) => {
  try {
    return await Club.create(data);
  } catch (err) {
    if (err.code === 11000) throw new ApiError(409, 'Club name already exists');
    throw err;
  }
};

const getAllClubs = async () => Club.find();

const getClubById = async (id) => {
  validateObjectId(id);
  const club = await Club.findById(id);
  if (!club) throw new ApiError(404, 'Club not found');
  return club;
};

const updateClub = async (id, data) => {
  validateObjectId(id);
  try {
    const club = await Club.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!club) throw new ApiError(404, 'Club not found');
    return club;
  } catch (err) {
    if (err.isOperational) throw err;
    if (err.code === 11000) throw new ApiError(409, 'Club name already exists');
    throw err;
  }
};

/**
 * Cascade delete: removes all events belonging to the club, then all
 * registrations for those events, then the club itself.
 * NOT atomic — a mid-sequence crash may leave orphaned documents (V1 trade-off).
 */
const deleteClub = async (id) => {
  validateObjectId(id);
  const club = await Club.findById(id);
  if (!club) throw new ApiError(404, 'Club not found');

  const Event = getEventModel();
  const Registration = getRegistrationModel();

  const events = await Event.find({ clubId: id }, '_id');
  const eventIds = events.map((e) => e._id);

  if (eventIds.length > 0) {
    await Registration.deleteMany({ eventId: { $in: eventIds } });
  }
  await Event.deleteMany({ clubId: id });
  await Club.findByIdAndDelete(id);
};

module.exports = { createClub, getAllClubs, getClubById, updateClub, deleteClub };
