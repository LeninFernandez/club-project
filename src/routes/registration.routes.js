const express = require('express');

const validate = require('../middlewares/validate');
const { createRegistrationSchema } = require('../validators/registration.validator');
const registrationController = require('../controllers/registration.controller');

const router = express.Router();

// ─── Registration Routes ──────────────────────────────────────────────────────
//
// IMPORTANT: GET /registrations/event/:eventId MUST be declared before
// DELETE /registrations/:id. Express matches routes in declaration order.
// If /:id were first, the string "event" would match :id and the GET
// route would never be reached.

// POST /registrations — register a participant for an event
router.post(
  '/',
  validate(createRegistrationSchema),
  registrationController.createRegistration
);

// GET /registrations — retrieve all registrations
router.get('/', registrationController.getAllRegistrations);

// GET /registrations/event/:eventId — retrieve all registrations for an event
// Declared before /:id to prevent "event" being matched as an id param.
router.get('/event/:eventId', registrationController.getRegistrationsByEvent);

// DELETE /registrations/:id — cancel a registration by its ID
router.delete('/:id', registrationController.deleteRegistration);

module.exports = router;
