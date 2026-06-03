const asyncHandler = require('../utils/asyncHandler');
const eventService = require('../services/event.service');

// ─── Create Event ─────────────────────────────────────────────────────────────

/**
 * POST /events
 * Creates a new event.
 * req.body has already been validated by validate(createEventSchema).
 * Service throws 404 if referenced club does not exist.
 */
const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event,
  });
});

// ─── Get All Events ───────────────────────────────────────────────────────────

/**
 * GET /events
 * Returns all events. Returns an empty array when no events exist.
 */
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getAllEvents();

  res.status(200).json({
    success: true,
    message: 'Events retrieved successfully',
    data: events,
  });
});

// ─── Get Event By ID ──────────────────────────────────────────────────────────

/**
 * GET /events/:id
 * Returns a single event by its MongoDB ObjectId.
 * Service throws 400 for invalid ObjectId format, 404 if not found.
 */
const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event retrieved successfully',
    data: event,
  });
});

// ─── Update Event ─────────────────────────────────────────────────────────────

/**
 * PUT /events/:id
 * Updates an existing event with the fields provided in req.body.
 * req.body has already been validated by validate(updateEventSchema).
 * Service throws 400 for invalid ObjectId, clubId mutation, or date range violation.
 * Service throws 404 if not found.
 */
const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: event,
  });
});

// ─── Delete Event ─────────────────────────────────────────────────────────────

/**
 * DELETE /events/:id
 * Deletes an event and cascade-deletes all related registrations.
 * Service throws 400 for invalid ObjectId, 404 if not found.
 * No data payload is returned — the resource no longer exists.
 */
const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
