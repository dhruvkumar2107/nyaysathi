const router = require("express").Router();
const CRMClient = require("../models/CRMClient");

// Add Client
router.post("/", async (req, res) => {
    try {
        const newClient = new CRMClient(req.body);
        await newClient.save();
        res.json(newClient);
    } catch (err) {
        res.status(500).json({ error: "Failed to add client" });
    }
});

// Get Clients for a Lawyer
router.get("/", async (req, res) => {
    try {
        const clients = await CRMClient.find({ lawyerId: req.query.lawyerId }).sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch clients" });
    }
});

module.exports = router;
