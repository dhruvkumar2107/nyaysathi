const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
// CREATE CASE
router.post("/", async (req, res) => {
  const c = new Case(req.body);
  await c.save();
  res.json(c);
});
// GET ALL CASES (With Filters)
router.get("/", async (req, res) => {
  const { postedBy, open } = req.query;
  let query = {};

  if (postedBy) query.postedBy = postedBy;
  if (open === "true") query.acceptedBy = null;

  try {
    const cases = await Case.find(query).sort({ postedAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});
// LAWYER ACCEPTS CASE
router.post("/:id/accept", async (req, res) => {
  const { id } = req.params;
  const { lawyerPhone, lawyerId } = req.body; // Added lawyerId support
  const updates = { acceptedBy: lawyerPhone, stage: 'Discovery' };
  if (lawyerId) updates.lawyer = lawyerId;

  const c = await Case.findByIdAndUpdate(
    id,
    updates,
    { new: true }
  );
  res.json(c);
});

// KANBAN STAGE UPDATE
router.patch("/:id/stage", async (req, res) => {
  try {
    const { stage } = req.body;
    const c = await Case.findByIdAndUpdate(req.params.id, { stage }, { new: true });
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
