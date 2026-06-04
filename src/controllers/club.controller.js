const asyncHandler = require('../utils/asyncHandler');
const clubService = require('../services/club.service');

const createClub = asyncHandler(async (req, res) => {
  const club = await clubService.createClub(req.body);
  res.status(201).json({ success: true, message: 'Club created successfully', data: club });
});

const getAllClubs = asyncHandler(async (req, res) => {
  const clubs = await clubService.getAllClubs();
  res.status(200).json({ success: true, message: 'Clubs retrieved successfully', data: clubs });
});

const getClubById = asyncHandler(async (req, res) => {
  const club = await clubService.getClubById(req.params.id);
  res.status(200).json({ success: true, message: 'Club retrieved successfully', data: club });
});

const updateClub = asyncHandler(async (req, res) => {
  const club = await clubService.updateClub(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Club updated successfully', data: club });
});

// Cascade-deletes all related events and registrations.
const deleteClub = asyncHandler(async (req, res) => {
  await clubService.deleteClub(req.params.id);
  res.status(200).json({ success: true, message: 'Club deleted successfully' });
});

module.exports = { createClub, getAllClubs, getClubById, updateClub, deleteClub };
