const asyncHandler = require('../utils/asyncHandler');
const clubService = require('../services/club.service');

// ─── Create Club ──────────────────────────────────────────────────────────────

/**
 * POST /clubs
 * Creates a new club.
 * req.body has already been validated by the validate(createClubSchema) middleware.
 */
const createClub = asyncHandler(async (req, res) => {
  const club = await clubService.createClub(req.body);

  res.status(201).json({
    success: true,
    message: 'Club created successfully',
    data: club,
  });
});

// ─── Get All Clubs ────────────────────────────────────────────────────────────

/**
 * GET /clubs
 * Returns all clubs. Returns an empty array when no clubs exist.
 */
const getAllClubs = asyncHandler(async (req, res) => {
  const clubs = await clubService.getAllClubs();

  res.status(200).json({
    success: true,
    message: 'Clubs retrieved successfully',
    data: clubs,
  });
});

// ─── Get Club By ID ───────────────────────────────────────────────────────────

/**
 * GET /clubs/:id
 * Returns a single club by its MongoDB ObjectId.
 * Service throws 400 for invalid ObjectId format, 404 if not found.
 */
const getClubById = asyncHandler(async (req, res) => {
  const club = await clubService.getClubById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Club retrieved successfully',
    data: club,
  });
});

// ─── Update Club ──────────────────────────────────────────────────────────────

/**
 * PUT /clubs/:id
 * Updates an existing club with the fields provided in req.body.
 * req.body has already been validated by the validate(updateClubSchema) middleware.
 * Service throws 400 for invalid ObjectId, 404 if not found, 409 on duplicate name.
 */
const updateClub = asyncHandler(async (req, res) => {
  const club = await clubService.updateClub(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Club updated successfully',
    data: club,
  });
});

// ─── Delete Club ──────────────────────────────────────────────────────────────

/**
 * DELETE /clubs/:id
 * Deletes a club and cascade-deletes all related events and registrations.
 * Service throws 400 for invalid ObjectId, 404 if not found.
 * No data payload is returned — the resource no longer exists.
 */
const deleteClub = asyncHandler(async (req, res) => {
  await clubService.deleteClub(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Club deleted successfully',
  });
});

module.exports = {
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
};
