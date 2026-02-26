const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
const User = require("../models/User");

// CREATE CASE
router.post("/", async (req, res) => {
  try {
    const c = new Case(req.body);
    await c.save();

    // Broadcast to all lawyers in the pool
    if (req.io) {
      req.io.to("lawyer_pool").emit("dashboard_alert", {
        message: `New Legal Matter: ${c.title}`,
        type: 'lead',
        link: '/leads'
      });
    }

    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Failed to post case" });
  }
});
// GET ALL CASES (With Filters)
router.get("/", async (req, res) => {
  const { postedBy, open, lawyerId } = req.query;
  let query = {};

  if (postedBy) query.postedBy = postedBy;
  if (open === "true") query.acceptedBy = null;
  if (lawyerId) query.lawyer = lawyerId;

  try {
    const cases = await Case.find(query).sort({ postedAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});
const Connection = require("../models/Connection");

// LAWYER ACCEPTS CASE
router.post("/:id/accept", async (req, res) => {
  const { id } = req.params;
  const { lawyerPhone, lawyerId } = req.body;

  try {
    const freshCase = await Case.findById(id);
    if (!freshCase) return res.status(404).json({ error: "Case not found" });

    const updates = { acceptedBy: lawyerPhone, stage: 'Discovery', lawyer: lawyerId };

    // Auto-create Connection
    if (freshCase.client && lawyerId) {
      await Connection.findOneAndUpdate(
        { clientId: freshCase.client, lawyerId: lawyerId },
        { status: "active", initiatedBy: lawyerId },
        { upsert: true, new: true }
      );
    }

    const c = await Case.findByIdAndUpdate(id, updates, { new: true });
    res.json(c);
  } catch (err) {
    console.error("Accept Lead Error:", err);
    res.status(500).json({ error: "Failed to accept lead" });
  }
});

// KANBAN STAGE UPDATE
router.patch("/:id/stage", async (req, res) => {
  try {
    const { stage } = req.body;
    const c = await Case.findByIdAndUpdate(req.params.id, { stage }, { new: true }).populate('client');
    
    // Notify the client about stage change
    if (c && c.client && req.io) {
      const Notification = require("../models/Notification");
      const notif = new Notification({
        userId: c.client._id,
        message: `Case Update: Your matter "${c.title}" has moved to ${stage}`,
        type: 'case',
        link: '/dashboard'
      });
      await notif.save();
      req.io.to(c.client._id.toString()).emit("dashboard_alert", notif);
    }
    
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Failed to update stage" });
  }
});

// TIMELINE UPDATE
router.post("/:id/timeline", async (req, res) => {
  try {
    const { title, status, desc } = req.body;
    const c = await Case.findById(req.params.id);
    c.timeline.push({ title, status, desc, date: new Date() });
    await c.save();
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: "Failed to add timeline event" });
  }
});

module.exports = router;
