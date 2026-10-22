const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const calendarRoutes = require('./routes/calendarRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusflow')
  .then(() => console.log('Connected to MongoDB database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register Routes
app.use('/api/calendar', calendarRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is listening on port ${PORT}`);
});