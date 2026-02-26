const express = require("express");
const router = express.Router();
const Connection = require("../models/Connection");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Helper to create notification and emit socket event
const createNotification = async (io, userId, message, type, link) => {
    try {
        const notif = new Notification({ userId, message, type, link });
        await notif.save();
        if (io) {
            io.to(userId.toString()).emit("dashboard_alert", notif);
        }
    } catch (err) {
        console.error("Notification Creation Error:", err);
    }
};

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
            if (existing.status === "pending") return res.status(400).json({ error: "Request already pending" });
        }

        const newConn = new Connection({
            clientId,
            lawyerId,
            initiatedBy,
            status: "pending"
        });

        await newConn.save();

        // Notify the recipient
        const recipientId = initiatedBy === clientId ? lawyerId : clientId;
        const initiator = await User.findById(initiatedBy);
        const recipient = await User.findById(recipientId);
        
        // Link to dashboard with correct tab
        const link = recipient.role === 'lawyer' ? "/lawyer/dashboard?tab=clients" : "/client/dashboard";

        await createNotification(
            req.io,
            recipientId,
            `New connection request from ${initiator?.name || "someone"}`,
            "connection",
            link
        );

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
        const connection = await Connection.findById(req.params.id);
        if (!connection) return res.status(404).json({ error: "Connection not found" });

        const oldStatus = connection.status;
        connection.status = status;
        await connection.save();

        // Notify the initiator (the one who sent the request)
        const initiatorId = connection.initiatedBy;
        const responderId = connection.clientId.toString() === initiatorId.toString() ? connection.lawyerId : connection.clientId;
        
        const initiator = await User.findById(initiatorId);
        const responder = await User.findById(responderId);
        
        let link = "/messages";
        if (status !== 'active') {
            link = initiator.role === 'lawyer' ? "/lawyer/dashboard" : "/client/dashboard";
        }

        await createNotification(
            req.io,
            initiatorId,
            `Connection request ${status} by ${responder?.name || "the other party"}`,
            "connection",
            link
        );

        res.json(connection);
    } catch (err) {
        console.error("Update Connection Error:", err);
        res.status(500).json({ error: "Failed to update connection" });
    }
});

module.exports = router;
