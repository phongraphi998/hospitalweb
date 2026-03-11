const pool = require('./API/config/db.js');

async function updateDb() {
  try {
    await pool.query(`
      ALTER TABLE patients 
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(5), 
      ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(20), 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'
    `);
    console.log('Columns added successfully');
  } catch (err) {
    console.error('Error adding columns:', err);
  } finally {
    pool.end();
  }
}

updateDb();
