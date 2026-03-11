const express = require('express');
const cors = require('cors');

// ROUTES
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes'); // มิว
const patientRoutes = require('./routes/patient.routes');
const staffRoutes = require('./routes/staff.routes'); // ของเธอ
const prescriptionRoutes = require('./routes/prescription.routes'); // ใบสั่งยา

const app = express();
const PORT = process.env.PORT || 3000;


// ================= MIDDLEWARE =================

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());


// ================= API ROUTES =================

app.use('/auth', authRoutes);

app.use('/appointments', appointmentRoutes); // มิว

app.use('/patients', patientRoutes);

app.use('/staff', staffRoutes); // staff API

app.use('/prescriptions', prescriptionRoutes); // ใบสั่งยา


// ================= HEALTH CHECK =================

app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});


// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


// ================= 404 =================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// ================= START SERVER =================

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {

  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
    console.error('Please close other terminal or stop the process running on this port.');
  }

  else {
    console.error('Server error:', err);
  }

});