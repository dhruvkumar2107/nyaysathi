const express = require("express");
const router = express.Router();
const Connection = require("../models/Connection");
const User = require("../models/User");

// GET /api/connections?userId=...
// Fetch all active connections for a user
// GET /api/connections?userId=...&status=...
// Fetch connections (default: active)
router.get("/", async (req, res) => {
    const { userId, status } = req.query;
    try {
        const query = { $or: [{ clientId: userId }, { lawyerId: userId }] };

        // If status is provided, use it. If 'all', don't filter by status. Default: 'active'
        if (status && status !== 'all') {
            query.status = status;
        } else if (!status) {
            query.status = "active";
        }

        const connections = await Connection.find(query)
            .populate("clientId", "name email phone role location plan")
            .populate("lawyerId", "name email phone role specialization location plan");

        // return the *other* person's profile mixed with connection metadata
        const profiles = connections.map(c => {
            const isClient = c.clientId._id.toString() === userId;
            const profile = isClient ? c.lawyerId : c.clientId;

            if (!profile) return null; // Handle deleted users

            return {
                ...profile.toObject(),
                connectionStatus: c.status,
                connectionId: c._id,
                initiatedBy: c.initiatedBy
            };
        }).filter(Boolean);

        res.json(profiles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch connections" });
    }
});

// POST /api/connections
// Request a connection
router.post("/", async (req, res) => {
    const { clientId, lawyerId, initiatedBy } = req.body;
    try {
        const existing = await Connection.findOne({ clientId, lawyerId });
        if (existing) {
            if (existing.status === "active") return res.status(400).json({ error: "Already connected" });
            if (existing.status === "pending") return res.status(400).json({ error: "Request already sending" });
        }

        // Create "pending" request
        const newConn = new Connection({
            clientId,
            lawyerId,
            initiatedBy,
            status: "pending"
        });

        await newConn.save();
        res.json(newConn);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to connect" });
    }
});

// PUT /api/connections/:id
// Update status (active/rejected)
router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body; // active, rejected
        const connection = await Connection.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(connection);
    } catch (err) {
        console.error("Update Connection Error:", err);
        res.status(500).json({ error: "Failed to update connection" });
    }
});

module.exports = router;
