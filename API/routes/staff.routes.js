const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /staff - returns all staff
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.first_name, s.last_name, s.specialization, s.phone,
             d.name AS department_name, u.role
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
