const mongoose = require('mongoose');
const Club = require('../models/club.model');
const ApiError = require('../utils/ApiError');

// Event and Registration models are imported here for cascade delete operations.
// The service accesses models directly — never other services — to avoid
// circular dependencies (per the architectural decision recorded in DECISIONS.md).
//
// NOTE: These models do not exist yet. They will be created in Tasks 8 and 11.
// The requires below are intentionally forward-declared so the cascade delete
// logic is complete and correct from the moment it is first used.
// Mongoose will resolve the model references at call-time, not at import-time,
// so this will NOT throw during startup before those models are registered.
const getEventModel = () => mongoose.model('Event');
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
 * Create a new club.
 *
 * @param {{ name: string, description: string }} data - Validated request body
 * @returns {Promise<Club>} The newly created club document
 * @throws {ApiError} 409 if club name already exists
 */
const createClub = async (data) => {
  try {
    const club = await Club.create(data);
    return club;
  } catch (err) {
    // MongoDB duplicate key error on the unique name index
    if (err.code === 11000) {
      throw new ApiError(409, 'Club name already exists');
    }
    throw err;
  }
};

/**
 * Retrieve all clubs.
 *
 * @returns {Promise<Club[]>} Array of all club documents (may be empty)
 */
const getAllClubs = async () => {
  const clubs = await Club.find();
  return clubs;
};

/**
 * Retrieve a single club by its MongoDB ObjectId.
 *
 * @param {string} id - Club _id
 * @returns {Promise<Club>} The matching club document
 * @throws {ApiError} 400 if id is not a valid ObjectId
 * @throws {ApiError} 404 if no club found with that id
 */
const getClubById = async (id) => {
  validateObjectId(id);

  const club = await Club.findById(id);
  if (!club) {
    throw new ApiError(404, 'Club not found');
  }
  return club;
};

/**
 * Update an existing club.
 * Accepts a partial payload — only provided fields are updated.
 *
 * @param {string} id   - Club _id
 * @param {object} data - Validated partial update body
 * @returns {Promise<Club>} The updated club document
 * @throws {ApiError} 400 if id is not a valid ObjectId
 * @throws {ApiError} 404 if no club found with that id
 * @throws {ApiError} 409 if the new name conflicts with another club
 */
const updateClub = async (id, data) => {
  validateObjectId(id);

  try {
    // { new: true }        → return the updated document, not the original
    // { runValidators: true } → run schema-level validators on the update
    const club = await Club.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!club) {
      throw new ApiError(404, 'Club not found');
    }
    return club;
  } catch (err) {
    // Re-throw ApiErrors (e.g. the 404 above) without wrapping them
    if (err.isOperational) throw err;

    // MongoDB duplicate key error on the unique name index
    if (err.code === 11000) {
      throw new ApiError(409, 'Club name already exists');
    }
    throw err;
  }
};

/**
 * Delete a club and cascade-delete all related events and registrations.
 *
 * Deletion order (leaf-nodes first to minimise orphan risk on partial failure):
 *   1. Find all Event documents where clubId === id
 *   2. Collect their _id values
 *   3. Delete all Registration documents where eventId is in that set
 *   4. Delete all Event documents where clubId === id
 *   5. Delete the Club document
 *
 * NOTE: This operation is NOT atomic (no transactions in V1).
 * A crash mid-sequence may leave orphaned documents.
 * This is a documented V1 trade-off recorded in the architecture decisions.
 *
 * @param {string} id - Club _id
 * @returns {Promise<void>}
 * @throws {ApiError} 400 if id is not a valid ObjectId
 * @throws {ApiError} 404 if no club found with that id
 */
const deleteClub = async (id) => {
  validateObjectId(id);

  const club = await Club.findById(id);
  if (!club) {
    throw new ApiError(404, 'Club not found');
  }

  const Event = getEventModel();
  const Registration = getRegistrationModel();

  // Step 1: Find all events belonging to this club
  const events = await Event.find({ clubId: id }, '_id');
  const eventIds = events.map((e) => e._id);

  // Step 2: Delete all registrations for those events (if any exist)
  if (eventIds.length > 0) {
    await Registration.deleteMany({ eventId: { $in: eventIds } });
  }

  // Step 3: Delete all events belonging to this club
  await Event.deleteMany({ clubId: id });

  // Step 4: Delete the club itself
  await Club.findByIdAndDelete(id);
};

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
};
