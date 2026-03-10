const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes'); //มิวเพิ่มบรรทัดนี้มาจ้า

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes); //มิวเพิ่มบรรทัดนี้มาจ้า

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use.`);
    console.error('Please close other terminal or stop the process running on this port.');
  } else {
    console.error('Server error:', err);
  }
});