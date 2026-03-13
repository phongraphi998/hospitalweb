const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecord.controller');

// GET /medical-records
router.get('/', medicalRecordController.getMedicalRecordsByDoctor);

// POST /medical-records
router.post('/', medicalRecordController.createMedicalRecord);

module.exports = router;
