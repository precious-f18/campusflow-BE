const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (Cleaned up for newer Mongoose versions)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusflow')
.then(() => console.log('Connected to MongoDB database'))
.catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', bookingRoutes); // Handles /api/bookings and conflict prevention

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is listening on port ${PORT}`);
});