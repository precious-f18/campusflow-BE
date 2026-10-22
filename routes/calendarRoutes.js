const express = require('express');
const router = express.Router();

// --- TEST SYNC ROUTE ---
router.post('/sync-calendar', async (req, res) => {
    try {
        const { room_name, booking_date, period, subject, booked_by } = req.body;
        console.log(`[Google Calendar Sync Simulation]: Event received for ${subject} in ${room_name} on ${booking_date} (${period}) by ${booked_by}`);

        res.status(200).json({ 
            success: true, 
            message: 'Simulated Google Calendar sync successful!',
            eventDetails: { room_name, booking_date, period, subject }
        });
    } catch (error) {
        console.error('Calendar Sync Error:', error);
        res.status(500).json({ error: 'Failed to synchronize with Google Calendar.' });
    }
});

module.exports = router;