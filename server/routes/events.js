const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET EVENTS (For a User)
router.get('/', async (req, res) => {
    const { userId, type } = req.query;
    try {
        const query = { $or: [{ lawyer: userId }, { client: userId }] };
        if (type) query.type = type;

        const events = await Event.find(query).sort({ start: 1 }).populate('client lawyer', 'name email');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// CREATE EVENT
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: "Failed to create event" });
    }
});

// UPDATE STATUS (e.g., Complete/Cancel)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

module.exports = router;
