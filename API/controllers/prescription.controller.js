const pool = require('../config/db');

// GET /prescriptions?doctor_id=X or ?user_id=X
// ดึงใบสั่งยาของ doctor นี้
exports.getPrescriptionsByDoctor = async (req, res) => {
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

  if (!doctor_id) {
    // Return all prescriptions (for testing/demo purposes)
    try {
      const query = `
        SELECT 
          p.id as prescription_id,
          p.appointment_id,
          p.created_at as prescription_date,
          a.patient_id,
          pt.first_name || ' ' || pt.last_name AS patient_name,
          s.first_name || ' ' || s.last_name AS doctor_name,
          d.name AS department_name,
          json_agg(json_build_object(
            'id', pi.id,
            'medicine_name', pi.medicine_name,
            'dosage', pi.dosage,
            'frequency', pi.frequency,
            'duration_days', pi.duration_days,
            'created_at', pi.created_at
          )) AS prescription_items
        FROM prescriptions p
        JOIN appointments a ON p.appointment_id = a.id
        JOIN patients pt ON a.patient_id = pt.id
        JOIN staff s ON a.doctor_id = s.id
        LEFT JOIN departments d ON a.department_id = d.id
        LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
        GROUP BY p.id, p.appointment_id, p.created_at, a.patient_id, 
                 pt.first_name, pt.last_name, s.first_name, s.last_name, d.name
        ORDER BY p.created_at DESC
      `;

      const result = await pool.query(query);

      return res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching all prescriptions:', error);
      return res.status(500).json({
        error: 'Failed to fetch prescriptions',
        details: error.message
      });
    }
  }

  try {
    const query = `
      SELECT 
        p.id as prescription_id,
        p.appointment_id,
        p.created_at as prescription_date,
        a.patient_id,
        pt.first_name || ' ' || pt.last_name AS patient_name,
        s.first_name || ' ' || s.last_name AS doctor_name,
        d.name AS department_name,
        json_agg(json_build_object(
          'id', pi.id,
          'medicine_name', pi.medicine_name,
          'dosage', pi.dosage,
          'frequency', pi.frequency,
          'duration_days', pi.duration_days,
          'created_at', pi.created_at
        )) AS prescription_items
      FROM prescriptions p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN patients pt ON a.patient_id = pt.id
      JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN departments d ON a.department_id = d.id
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
      WHERE a.doctor_id = $1
      GROUP BY p.id, p.appointment_id, p.created_at, a.patient_id, 
               pt.first_name, pt.last_name, s.first_name, s.last_name, d.name
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, [doctor_id]);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({
      error: 'Failed to fetch prescriptions',
      details: error.message
    });
  }
};

// POST /prescriptions
// สร้างใบสั่งยาใหม่
exports.createPrescription = async (req, res) => {
  const { appointment_id, prescription_items } = req.body;

  // Validation
  if (!appointment_id) {
    return res.status(400).json({ 
      error: 'appointment_id is required' 
    });
  }

  if (!prescription_items || !Array.isArray(prescription_items) || prescription_items.length === 0) {
    return res.status(400).json({ 
      error: 'prescription_items array is required and must contain at least one item' 
    });
  }

  // Validate each prescription item
  for (const item of prescription_items) {
    if (!item.medicine_name || !item.dosage || !item.frequency || !item.duration_days) {
      return res.status(400).json({
        error: 'Each prescription item must have: medicine_name, dosage, frequency, duration_days'
      });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if prescription already exists for this appointment
    const existingCheck = await client.query(
      'SELECT id FROM prescriptions WHERE appointment_id = $1',
      [appointment_id]
    );

    if (existingCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Prescription already exists for this appointment',
        existingPrescriptionId: existingCheck.rows[0].id,
        message: 'Each appointment can only have one prescription. Please update the existing prescription or select a different appointment.'
      });
    }

    // Create prescription
    const prescriptionResult = await client.query(
      'INSERT INTO prescriptions (appointment_id) VALUES ($1) RETURNING *',
      [appointment_id]
    );

    const prescription_id = prescriptionResult.rows[0].id;

    // Insert prescription items
    const items = [];
    for (const item of prescription_items) {
      const itemResult = await client.query(
        `INSERT INTO prescription_items 
         (prescription_id, medicine_name, dosage, frequency, duration_days) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [prescription_id, item.medicine_name, item.dosage, item.frequency, item.duration_days]
      );
      items.push(itemResult.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: {
        id: prescription_id,
        appointment_id,
        created_at: prescriptionResult.rows[0].created_at,
        prescription_items: items
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating prescription:', error);
    res.status(500).json({
      error: 'Failed to create prescription',
      details: error.message
    });
  } finally {
    client.release();
  }
};

// GET /prescriptions/:id
// ดึงรายละเอียดใบสั่งยาเดียว
exports.getPrescriptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        p.id as prescription_id,
        p.appointment_id,
        p.created_at as prescription_date,
        a.patient_id,
        pt.first_name || ' ' || pt.last_name AS patient_name,
        s.first_name || ' ' || s.last_name AS doctor_name,
        json_agg(json_build_object(
          'id', pi.id,
          'medicine_name', pi.medicine_name,
          'dosage', pi.dosage,
          'frequency', pi.frequency,
          'duration_days', pi.duration_days,
          'created_at', pi.created_at
        )) AS prescription_items
      FROM prescriptions p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN patients pt ON a.patient_id = pt.id
      JOIN staff s ON a.doctor_id = s.id
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
      WHERE p.id = $1
      GROUP BY p.id, p.appointment_id, p.created_at, a.patient_id,
               pt.first_name, pt.last_name, s.first_name, s.last_name
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({
      error: 'Failed to fetch prescription',
      details: error.message
    });
  }
};

// DELETE /prescriptions/:id
// ลบใบสั่งยา
exports.deletePrescription = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete prescription items first (due to foreign key)
    await client.query('DELETE FROM prescription_items WHERE prescription_id = $1', [id]);

    // Delete prescription
    const result = await client.query(
      'DELETE FROM prescriptions WHERE id = $1 RETURNING *',
      [id]
    );

    await client.query('COMMIT');

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting prescription:', error);
    res.status(500).json({
      error: 'Failed to delete prescription',
      details: error.message
    });
  } finally {
    client.release();
  }
};
