const asyncHandler = require('../utils/asyncHandler');
const eventService = require('../services/event.service');

const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(201).json({ success: true, message: 'Event created successfully', data: event });
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getAllEvents();
  res.status(200).json({ success: true, message: 'Events retrieved successfully', data: events });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  res.status(200).json({ success: true, message: 'Event retrieved successfully', data: event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
});

// Cascade-deletes all related registrations.
const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);
  res.status(200).json({ success: true, message: 'Event deleted successfully' });
});

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
