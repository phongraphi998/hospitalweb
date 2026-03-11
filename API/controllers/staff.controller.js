const db = require('../config/db')


// GET /staff
exports.getAllStaff = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.id,
             s.user_id,
             u.email,
             u.role,
             s.first_name,
             s.last_name,
             s.department_id,
             d.name AS department_name,
             s.specialization,
             s.phone,
             s.created_at
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.id DESC
    `)

    res.json(result.rows)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /staff/:id
exports.getStaffById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(`
      SELECT s.id,
             s.user_id,
             u.email,
             u.role,
             s.first_name,
             s.last_name,
             s.department_id,
             d.name AS department_name,
             s.specialization,
             s.phone,
             s.created_at
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(result.rows[0])

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}


const bcrypt = require('bcrypt'); // Added bcrypt for user password hashing

// POST /staff
exports.createStaff = async (req, res) => {
  try {

    const {
      email,
      role,
      first_name,
      last_name,
      department_id,
      specialization,
      phone
    } = req.body

    // 1. Create User
    const defaultPassword = 'password123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);
    
    // Generate a default email if not provided
    const userEmail = email || `staff_${Date.now()}@hospital.com`;
    const userRole = role ? role.toUpperCase() : 'DOCTOR';

    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id`,
      [userEmail, passwordHash, userRole]
    );

    const newUserId = userResult.rows[0].id;

    // 2. Create Staff linking to the new User
    const result = await db.query(
      `INSERT INTO staff
      (user_id, first_name, last_name, department_id, specialization, phone)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [newUserId, first_name, last_name, department_id, specialization, phone]
    )

    res.json(result.rows[0])

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  }
}


// PUT /staff/:id
exports.updateStaff = async (req, res) => {

  try {

    const id = req.params.id

    const {
      first_name,
      last_name,
      department_id,
      specialization,
      phone
    } = req.body

    const result = await db.query(
      `UPDATE staff
      SET first_name=$1,
          last_name=$2,
          department_id=$3,
          specialization=$4,
          phone=$5
      WHERE id=$6
      RETURNING *`,
      [first_name, last_name, department_id, specialization, phone, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(result.rows[0])

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: 'Server error' })

  }
}


// DELETE /staff/:id
exports.deleteStaff = async (req, res) => {

  try {

    const id = req.params.id

    const result = await db.query(
      `DELETE FROM staff WHERE id=$1 RETURNING id`,
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json({ message: 'Staff deleted successfully' })

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: 'Server error' })

  }

}