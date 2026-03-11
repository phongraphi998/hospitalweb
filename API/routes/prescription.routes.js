const express = require('express');
const router = express.Router();

const prescriptionController = require('../controllers/prescription.controller');

// GET prescriptions for a doctor
// Usage: GET /prescriptions?doctor_id=1
router.get('/', prescriptionController.getPrescriptionsByDoctor);

// GET specific prescription by ID
router.get('/:id', prescriptionController.getPrescriptionById);

// POST create new prescription
router.post('/', prescriptionController.createPrescription);

// DELETE prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
