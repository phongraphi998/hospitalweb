const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');

// GET /staff - returns all staff
router.get('/', staffController.getAllStaff);

// GET /staff/:id - get staff by id
router.get('/:id', staffController.getStaffById);

// POST /staff - create a new staff
router.post('/', staffController.createStaff);

// PUT /staff/:id - update staff
router.put('/:id', staffController.updateStaff);

// DELETE /staff/:id - delete staff
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
