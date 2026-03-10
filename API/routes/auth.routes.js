const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Root auth route for status check
router.get('/', (req, res) => {
  res.json({ message: 'Auth API is active' });
});

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.me);

module.exports = router;
