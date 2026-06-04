const asyncHandler = require('../utils/asyncHandler');
const registrationService = require('../services/registration.service');

const createRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.createRegistration(req.body);
  res.status(201).json({ success: true, message: 'Registration created successfully', data: registration });
});

const getRegistrationsByEvent = asyncHandler(async (req, res) => {
  const registrations = await registrationService.getRegistrationsByEvent(req.params.eventId);
  res.status(200).json({ success: true, message: 'Registrations retrieved successfully', data: registrations });
});

const getAllRegistrations = asyncHandler(async (req, res) => {
  const registrations = await registrationService.getAllRegistrations();
  res.status(200).json({ success: true, message: 'Registrations retrieved successfully', data: registrations });
});

const deleteRegistration = asyncHandler(async (req, res) => {
  await registrationService.deleteRegistration(req.params.id);
  res.status(200).json({ success: true, message: 'Registration cancelled successfully' });
});

module.exports = { createRegistration, getAllRegistrations, getRegistrationsByEvent, deleteRegistration };
