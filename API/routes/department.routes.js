const express = require('express');
const departmentController = require('../controllers/department.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);

// Protected routes (require authentication)
router.post('/', authMiddleware, departmentController.create);
router.put('/:id', authMiddleware, departmentController.update);
router.delete('/:id', authMiddleware, departmentController.remove);

module.exports = router;
