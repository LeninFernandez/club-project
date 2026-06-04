const express = require('express');

const validate = require('../middlewares/validate');
const { createEventSchema, updateEventSchema } = require('../validators/event.validator');
const eventController = require('../controllers/event.controller');

const router = express.Router();


// POST /events — create a new event
router.post('/', validate(createEventSchema), eventController.createEvent);

// GET /events — retrieve all events
router.get('/', eventController.getAllEvents);

// GET /events/:id — retrieve a single event by ID
router.get('/:id', eventController.getEventById);

// PUT /events/:id — update an existing event (partial update supported)
router.put('/:id', validate(updateEventSchema), eventController.updateEvent);

// DELETE /events/:id — delete an event and cascade-delete related registrations
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
