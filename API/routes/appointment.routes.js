const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointment.controller');

// GET all appointments
router.get('/', appointmentController.getAppointments);

// UPDATE appointment status
router.put('/:id/status', appointmentController.updateStatus);

router.post('/', appointmentController.createAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;