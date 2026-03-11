const pool = require('../config/db');

// GET /patients
exports.getPatients = async (req, res) => {

  const { search } = req.query;

  try {

    let query = `
      SELECT p.*,
        (
          SELECT TO_CHAR(a.start_time, 'DD Mon YYYY')
          FROM appointments a
          WHERE a.patient_id = p.id
          ORDER BY a.start_time DESC
          LIMIT 1
        ) AS last_visit,
        (
          SELECT mr.diagnosis
          FROM medical_records mr
          JOIN appointments a ON mr.appointment_id = a.id
          WHERE a.patient_id = p.id
          ORDER BY mr.created_at DESC
          LIMIT 1
        ) AS condition
      FROM patients p
    `;

    const values = [];

    if (search) {
      values.push(`%${search}%`);
      query += `
        WHERE p.first_name ILIKE $1
        OR p.last_name ILIKE $1
        OR p.phone ILIKE $1
        OR p.blood_group ILIKE $1
      `;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// GET /patients/:id
exports.getPatientById = async (req, res) => {

  const id = req.params.id;

  try {

    const result = await pool.query(
      `SELECT *
       FROM patients
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// POST /patients
exports.createPatient = async (req, res) => {

  const {
    first_name,
    last_name,
    gender,
    birth_date,
    phone,
    address,
    blood_group,
    emergency_contact,
    status
  } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO patients
       (first_name, last_name, gender, birth_date, phone, address, blood_group, emergency_contact, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        first_name,
        last_name,
        gender,
        birth_date || null,
        phone,
        address,
        blood_group || null,
        emergency_contact || null,
        status || 'Active'
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// PUT /patients/:id
exports.updatePatient = async (req, res) => {

  const id = req.params.id;

  const {
    first_name,
    last_name,
    gender,
    birth_date,
    phone,
    address,
    blood_group,
    emergency_contact,
    status
  } = req.body;

  try {

    const result = await pool.query(
      `UPDATE patients
       SET first_name=$1,
           last_name=$2,
           gender=$3,
           birth_date=$4,
           phone=$5,
           address=$6,
           blood_group=$7,
           emergency_contact=$8,
           status=$9
       WHERE id=$10
       RETURNING *`,
      [
        first_name,
        last_name,
        gender,
        birth_date || null,
        phone,
        address,
        blood_group || null,
        emergency_contact || null,
        status || 'Active',
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// DELETE /patients/:id
exports.deletePatient = async (req, res) => {

  const id = req.params.id;

  try {

    const result = await pool.query(
      `DELETE FROM patients
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json({ message: "Patient deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};