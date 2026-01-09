const express = require('express');
const router = express.Router();
const User = require('../models/User');
// All users OR search
router.get('/', async (req, res) => {
  const { q, role } = req.query;
  let filter = {};

  if (role) {
    filter.role = role;
  }

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { phone: { $regex: q } }
    ];
  }
  const users = await User.find(filter).limit(200);
  res.json(users);
});
// Get one user by ID, Phone, or Email
router.get('/:id', async (req, res) => {
  let query = {};
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    query = { _id: req.params.id };
  } else if (req.params.id.includes('@')) {
    query = { email: req.params.id };
  } else {
    query = { phone: req.params.id };
  }

  const user = await User.findOne(query);
  if (!user) return res.status(404).end();
  res.json(user);
});

// Update user by ID, Phone, or Email
router.put('/:id', async (req, res) => {
  let query = {};
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    query = { _id: req.params.id };
  } else if (req.params.id.includes('@')) {
    query = { email: req.params.id };
  } else {
    query = { phone: req.params.id };
  }

  const updated = await User.findOneAndUpdate(
    query,
    req.body,
    { new: true }
  );
  res.json(updated);
});
// GET /api/users/public/:id - Get Public Profile of any user (usually lawyer)
router.get("/public/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -__v -otp -otpExpires"); // Exclude sensitive hidden fields

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
