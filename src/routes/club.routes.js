const express = require('express');

const validate = require('../middlewares/validate');
const { createClubSchema, updateClubSchema } = require('../validators/club.validator');
const clubController = require('../controllers/club.controller');

const router = express.Router();

// POST /clubs — create a new club
router.post('/', validate(createClubSchema), clubController.createClub);

// GET /clubs — retrieve all clubs
router.get('/', clubController.getAllClubs);

// GET /clubs/:id — retrieve a single club by ID
router.get('/:id', clubController.getClubById);

// PUT /clubs/:id — update an existing club
router.put('/:id', validate(updateClubSchema), clubController.updateClub);

// DELETE /clubs/:id — delete a club and cascade-delete related events and registrations
router.delete('/:id', clubController.deleteClub);

module.exports = router;
