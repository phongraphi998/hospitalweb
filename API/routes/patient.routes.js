const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patient.controller');

// GET all patients
router.get('/', patientController.getPatients);

// GET patient by id
router.get('/:id', patientController.getPatientById);

// CREATE patient
router.post('/', patientController.createPatient);

// UPDATE patient
router.put('/:id', patientController.updatePatient);

// DELETE patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;