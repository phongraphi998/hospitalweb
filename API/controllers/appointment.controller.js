const pool = require('../config/db');


// GET /appointments
// รองรับ query ?doctor_id= และ ?date=
exports.getAppointments = async (req, res) => {

  const { doctor_id, date } = req.query;

  try {

    let query = `
      SELECT a.*, 
             p.first_name || ' ' || p.last_name AS patient_name,
             s.first_name || ' ' || s.last_name AS doctor_name,
             d.name AS department_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN departments d ON a.department_id = d.id
    `;

    const conditions = [];
    const values = [];

    if (doctor_id) {
      values.push(doctor_id);
      conditions.push(`a.doctor_id = $${values.length}`);
    }

    if (date) {
      values.push(date);
      conditions.push(`DATE(a.start_time) = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY a.start_time DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};



// PUT /appointments/:id
exports.updateAppointment = async (req, res) => {

  const id = req.params.id;
  const { status, reason, start_time } = req.body;

  try {

    const result = await pool.query(
      `UPDATE appointments
       SET status = COALESCE($1, status),
           reason = COALESCE($2, reason),
           start_time = COALESCE($3, start_time)
       WHERE id = $4
       RETURNING *`,
      [status || null, reason !== undefined ? reason : null, start_time || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// PUT /appointments/:id/status
exports.updateStatus = async (req, res) => {

  const id = req.params.id;
  const { status } = req.body;

  try {

    const result = await pool.query(
      `UPDATE appointments
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};
// POST /appointments
exports.createAppointment = async (req, res) => {

  const { patient_id, doctor_id, department_id, start_time, reason } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO appointments
       (patient_id, doctor_id, department_id, start_time, reason)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [patient_id, doctor_id, department_id, start_time, reason]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// DELETE /appointments/:id
exports.deleteAppointment = async (req, res) => {

  const id = req.params.id;

  try {

    const result = await pool.query(
      `DELETE FROM appointments
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};