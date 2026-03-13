const express = require('express');
const router = express.Router();

const billingController = require('../controllers/billing.controller');

// GET all billings (with optional ?status= and ?patient_id= filters)
router.get('/', billingController.getBillings);

// GET single billing by ID
router.get('/:id', billingController.getBillingById);

// CREATE new billing with items
router.post('/', billingController.createBilling);

// UPDATE billing (status, total_amount)
router.put('/:id', billingController.updateBilling);

// Mark billing as PAID
router.put('/:id/pay', billingController.markPaid);

// DELETE billing
router.delete('/:id', billingController.deleteBilling);

module.exports = router;
