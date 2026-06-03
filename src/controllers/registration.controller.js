const asyncHandler = require('../utils/asyncHandler');
const registrationService = require('../services/registration.service');

// ─── Create Registration ──────────────────────────────────────────────────────

/**
 * POST /registrations
 * Registers a participant for an event.
 * req.body has already been validated by validate(createRegistrationSchema).
 * Service throws 404 if event not found, 409 on duplicate registration.
 */
const createRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.createRegistration(req.body);

  res.status(201).json({
    success: true,
    message: 'Registration created successfully',
    data: registration,
  });
});

// ─── Get Registrations By Event ───────────────────────────────────────────────

/**
 * GET /registrations/event/:eventId
 * Returns all registrations for a specific event.
 * Service throws 400 for invalid ObjectId format.
 * Returns empty array when no registrations exist for the event.
 */
const getRegistrationsByEvent = asyncHandler(async (req, res) => {
  const registrations = await registrationService.getRegistrationsByEvent(
    req.params.eventId
  );

  res.status(200).json({
    success: true,
    message: 'Registrations retrieved successfully',
    data: registrations,
  });
});

// ─── Delete Registration ──────────────────────────────────────────────────────

/**
 * DELETE /registrations/:id
 * Cancels a registration by its MongoDB ObjectId.
 * Service throws 400 for invalid ObjectId, 404 if not found.
 * No data payload is returned — the resource no longer exists.
 */
const deleteRegistration = asyncHandler(async (req, res) => {
  await registrationService.deleteRegistration(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Registration cancelled successfully',
  });
});

module.exports = {
  createRegistration,
  getRegistrationsByEvent,
  deleteRegistration,
};
