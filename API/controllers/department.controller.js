const pool = require('../config/db');

// GET /departments
const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, code, name, head, phone, floor, status, description, created_at, updated_at FROM departments ORDER BY id ASC'
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get departments error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /departments/:id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, code, name, head, phone, floor, status, description, created_at, updated_at FROM departments WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get department by id error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /departments
const create = async (req, res) => {
  try {
    const { code, name, head, phone, floor, status, description } = req.body;

    // Validation
    if (!code || !name) {
      return res.status(400).json({ error: 'Code and Name are required' });
    }

    // Check duplicate code
    const existing = await pool.query('SELECT id FROM departments WHERE code = $1', [code]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Department code already exists' });
    }

    const result = await pool.query(
      `INSERT INTO departments (code, name, head, phone, floor, status, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, code, name, head, phone, floor, status, description, created_at, updated_at`,
      [
        code,
        name,
        head || '',
        phone || '',
        floor || '',
        status || 'Active',
        description || null
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create department error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /departments/:id
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, head, phone, floor, status, description } = req.body;

    // Check exists
    const existing = await pool.query('SELECT id FROM departments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Validation
    if (!code || !name) {
      return res.status(400).json({ error: 'Code and Name are required' });
    }

    // Check duplicate code (exclude self)
    const dup = await pool.query('SELECT id FROM departments WHERE code = $1 AND id != $2', [code, id]);
    if (dup.rows.length > 0) {
      return res.status(409).json({ error: 'Department code already exists' });
    }

    const result = await pool.query(
      `UPDATE departments
       SET code = $1, name = $2, head = $3, phone = $4, floor = $5, status = $6, description = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING id, code, name, head, phone, floor, status, description, created_at, updated_at`,
      [
        code,
        name,
        head || '',
        phone || '',
        floor || '',
        status || 'Active',
        description || null,
        id
      ]
    );

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Update department error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /departments/:id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT id FROM departments WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await pool.query('DELETE FROM departments WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
