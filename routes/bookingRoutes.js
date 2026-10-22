const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// --- GET ALL BOOKINGS ---
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        const formatted = bookings.map(b => ({
            id: b._id,
            room_name: b.room_name,
            booking_date: b.booking_date,
            until_date: b.until_date,
            period: b.period,
            subject: b.subject,
            booked_by: b.booked_by,
            booking_type: b.booking_type,
            status: b.status
        }));
        res.status(200).json(formatted);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Server error while fetching bookings.' });
    }
});

// --- POST: CREATE BOOKING WITH CONFLICT PREVENTION ---
router.post('/bookings', async (req, res) => {
    try {
        const { room_name, booking_date, period, until_date, booking_type } = req.body;
        const targetDate = booking_date ? booking_date.split('T')[0] : '';
        const typeStr = booking_type ? booking_type.toLowerCase() : 'one-time';

        if (!room_name || !targetDate || !period) {
            return res.status(400).json({ error: 'Missing required booking fields.' });
        }

        // 1. Check for One-Time Booking Conflicts
        if (typeStr === 'one-time' || !until_date || until_date === 'Ending of session') {
            const existingConflict = await Booking.findOne({
                room_name: room_name,
                period: period,
                $or: [
                    // Exact match for one-time bookings on this date (case-insensitive regex on type)
                    { 
                        booking_date: { $regex: targetDate }, 
                        booking_type: { $regex: /^one-time/i } 
                    },
                    // Falls inside an active recurring booking window
                    {
                        booking_type: { $regex: /^recurring/i },
                        booking_date: { $lte: targetDate },
                        until_date: { $gte: targetDate }
                    }
                ]
            });

            if (existingConflict) {
                return res.status(400).json({ error: `Conflict: ${room_name} is already booked for ${period} on ${targetDate}.` });
            }
        } 
        // 2. Check for Recurring Booking Conflicts over a date range
        else {
            const startDate = targetDate;
            const endDate = until_date.split('T')[0];

            const rangeConflict = await Booking.findOne({
                room_name: room_name,
                period: period,
                $or: [
                    {
                        booking_type: { $regex: /^one-time/i },
                        booking_date: { $gte: startDate, $lte: endDate }
                    },
                    {
                        booking_type: { $regex: /^recurring/i },
                        booking_date: { $lte: endDate },
                        until_date: { $gte: startDate }
                    }
                ]
            });

            if (rangeConflict) {
                return res.status(400).json({ error: `Conflict: A booking already exists in ${room_name} for ${period} within this date range.` });
            }
        }

        const newBooking = new Booking(req.body);
        await newBooking.save();

        res.status(201).json({ message: 'Booking confirmed successfully!', booking: newBooking });
    } catch (error) {
        console.error('Booking save error:', error);
        res.status(500).json({ error: 'Server error while processing booking.' });
    }
});

// --- DELETE BOOKING ---
router.delete('/bookings/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting booking.' });
    }
});

module.exports = router;