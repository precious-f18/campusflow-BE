const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room_name: { type: String, required: true },
  booking_date: { type: String, required: true },
  until_date: { type: String },
  period: { type: String, required: true },
  subject: { type: String, required: true },
  booked_by: { type: String, required: true },
  booking_type: { type: String, default: 'One-Time' },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);