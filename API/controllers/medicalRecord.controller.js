const pool = require('../config/db');

// GET /medical-records?doctor_id=X or ?user_id=X
exports.getMedicalRecordsByDoctor = async (req, res) => {
  let { doctor_id, user_id } = req.query;

  // If user_id is provided, resolve to staff.id (doctor_id)
  if (!doctor_id && user_id) {
    try {
      const staffResult = await pool.query(
        'SELECT id FROM staff WHERE user_id = $1',
        [user_id]
      );
      if (staffResult.rows.length > 0) {
        doctor_id = staffResult.rows[0].id;
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    } catch (err) {
      console.error('Error resolving user_id to staff:', err);
      return res.status(500).json({ error: 'Failed to resolve user' });
    }
  }

  try {
    let query;
    let params = [];

    if (!doctor_id) {
      query = `
        SELECT 
          mr.id as record_id,
          mr.appointment_id,
          mr.diagnosis,
          mr.treatment,
          mr.notes,
          mr.created_at as record_date,
          a.patient_id,
          pt.first_name || ' ' || pt.last_name AS patient_name,
          s.first_name || ' ' || s.last_name AS doctor_name
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN patients pt ON a.patient_id = pt.id
        JOIN staff s ON a.doctor_id = s.id
        ORDER BY mr.created_at DESC
      `;
    } else {
      query = `
        SELECT 
          mr.id as record_id,
          mr.appointment_id,
          mr.diagnosis,
          mr.treatment,
          mr.notes,
          mr.created_at as record_date,
          a.patient_id,
          pt.first_name || ' ' || pt.last_name AS patient_name,
          s.first_name || ' ' || s.last_name AS doctor_name
        FROM medical_records mr
        JOIN appointments a ON mr.appointment_id = a.id
        JOIN patients pt ON a.patient_id = pt.id
        JOIN staff s ON a.doctor_id = s.id
        WHERE a.doctor_id = $1
        ORDER BY mr.created_at DESC
      `;
      params = [doctor_id];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      error: 'Failed to fetch medical records',
      details: error.message
    });
  }
};

// POST /medical-records
exports.createMedicalRecord = async (req, res) => {
  const { appointment_id, diagnosis, treatment, notes } = req.body;

  if (!appointment_id || !diagnosis || !notes) {
    return res.status(400).json({ 
      error: 'appointment_id, diagnosis, and notes are required' 
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if record already exists for this appointment
    const existingCheck = await client.query(
      'SELECT id FROM medical_records WHERE appointment_id = $1',
      [appointment_id]
    );

    if (existingCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Medical record already exists for this appointment'
      });
    }

    // Insert record
    const result = await client.query(
      `INSERT INTO medical_records (appointment_id, diagnosis, treatment, notes) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [appointment_id, diagnosis, treatment || '', notes]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating medical record:', error);
    res.status(500).json({
      error: 'Failed to create medical record',
      details: error.message
    });
  } finally {
    client.release();
  }
};
