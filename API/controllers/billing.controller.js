const pool = require('../config/db');


// ==================== INIT TABLES ====================
const initTables = async () => {
  try {
    // สร้างตาราง billing_items ถ้ายังไม่มี
    await pool.query(`
      CREATE TABLE IF NOT EXISTS billing_items (
        id SERIAL PRIMARY KEY,
        billing_id INTEGER NOT NULL REFERENCES billing(id) ON DELETE CASCADE,
        description VARCHAR(255) NOT NULL,
        qty INTEGER NOT NULL DEFAULT 1,
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        total NUMERIC(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // เพิ่ม column patient_name ในตาราง billing ถ้ายังไม่มี
    await pool.query(`
      ALTER TABLE billing ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255)
    `);
  } catch (err) {
    console.error('Failed to init billing tables:', err.message);
  }
};
initTables();


// ==================== GET /billing ====================
// ดึงรายการ billing ทั้งหมด พร้อม join ข้อมูลผู้ป่วย
exports.getBillings = async (req, res) => {

  const { status, patient_id } = req.query;

  try {

    let query = `
      SELECT b.*,
             a.patient_id,
             a.doctor_id,
             a.start_time AS appointment_date,
             COALESCE(b.patient_name, p.first_name || ' ' || p.last_name) AS patient_name,
             s.first_name || ' ' || s.last_name AS doctor_name
      FROM billing b
      LEFT JOIN appointments a ON b.appointment_id = a.id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN staff s ON a.doctor_id = s.id
    `;

    const conditions = [];
    const values = [];

    if (status) {
      values.push(status.toUpperCase());
      conditions.push(`b.status = $${values.length}`);
    }

    if (patient_id) {
      values.push(patient_id);
      conditions.push(`a.patient_id = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY b.issued_at DESC`;

    const result = await pool.query(query, values);

    // สำหรับแต่ละ billing ดึง items ด้วย
    const billings = [];
    for (const row of result.rows) {
      const itemsResult = await pool.query(
        `SELECT * FROM billing_items WHERE billing_id = $1 ORDER BY id`,
        [row.id]
      );
      billings.push({
        ...row,
        items: itemsResult.rows
      });
    }

    res.json(billings);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// ==================== GET /billing/:id ====================
exports.getBillingById = async (req, res) => {

  const id = req.params.id;

  try {

    const result = await pool.query(
      `SELECT b.*,
              a.patient_id,
              a.doctor_id,
              a.start_time AS appointment_date,
              COALESCE(b.patient_name, p.first_name || ' ' || p.last_name) AS patient_name,
              s.first_name || ' ' || s.last_name AS doctor_name
       FROM billing b
       LEFT JOIN appointments a ON b.appointment_id = a.id
       LEFT JOIN patients p ON a.patient_id = p.id
       LEFT JOIN staff s ON a.doctor_id = s.id
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Billing not found' });
    }

    const itemsResult = await pool.query(
      `SELECT * FROM billing_items WHERE billing_id = $1 ORDER BY id`,
      [id]
    );

    res.json({
      ...result.rows[0],
      items: itemsResult.rows
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// ==================== POST /billing ====================
// สร้าง billing ใหม่ พร้อม items
exports.createBilling = async (req, res) => {

  const { appointment_id, total_amount, items, discount, patient_name } = req.body;

  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    // คำนวณ total_amount จาก items ถ้าไม่ส่งมา
    let calculatedTotal = total_amount || 0;
    if (items && items.length > 0 && !total_amount) {
      calculatedTotal = items.reduce((sum, item) => {
        return sum + (item.qty || 1) * (item.price || 0);
      }, 0);
    }

    // หัก discount
    if (discount && discount > 0) {
      calculatedTotal = calculatedTotal - discount;
    }

    const billingResult = await client.query(
      `INSERT INTO billing (appointment_id, total_amount, status, patient_name)
       VALUES ($1, $2, 'UNPAID', $3)
       RETURNING *`,
      [appointment_id || null, calculatedTotal, patient_name || null]
    );

    const billing = billingResult.rows[0];

    // Insert items ถ้ามี
    const insertedItems = [];
    if (items && items.length > 0) {
      for (const item of items) {
        const itemTotal = (item.qty || 1) * (item.price || 0);
        const itemResult = await client.query(
          `INSERT INTO billing_items (billing_id, description, qty, price, total)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [billing.id, item.description, item.qty || 1, item.price || 0, itemTotal]
        );
        insertedItems.push(itemResult.rows[0]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      ...billing,
      items: insertedItems
    });

  } catch (error) {

    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server error' });

  } finally {
    client.release();
  }

};


// ==================== PUT /billing/:id ====================
// อัพเดท billing (status, total_amount)
exports.updateBilling = async (req, res) => {

  const id = req.params.id;
  const { status, total_amount } = req.body;

  try {

    // ถ้าเปลี่ยนเป็น PAID ให้บันทึก paid_at
    let paid_at_clause = '';
    const values = [];

    if (status === 'PAID') {
      paid_at_clause = ', paid_at = CURRENT_TIMESTAMP';
    }

    const result = await pool.query(
      `UPDATE billing
       SET status = COALESCE($1, status),
           total_amount = COALESCE($2, total_amount)
           ${paid_at_clause}
       WHERE id = $3
       RETURNING *`,
      [status || null, total_amount || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Billing not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// ==================== PUT /billing/:id/pay ====================
// มาร์คเป็น PAID
exports.markPaid = async (req, res) => {

  const id = req.params.id;

  try {

    const result = await pool.query(
      `UPDATE billing
       SET status = 'PAID', paid_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Billing not found' });
    }

    // ดึง items ด้วย
    const itemsResult = await pool.query(
      `SELECT * FROM billing_items WHERE billing_id = $1 ORDER BY id`,
      [id]
    );

    res.json({
      ...result.rows[0],
      items: itemsResult.rows
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};


// ==================== DELETE /billing/:id ====================
exports.deleteBilling = async (req, res) => {

  const id = req.params.id;

  try {

    // items จะถูกลบ cascade ตาม FK
    const result = await pool.query(
      `DELETE FROM billing
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Billing not found' });
    }

    res.json({ message: 'Billing deleted' });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Server error' });

  }

};
