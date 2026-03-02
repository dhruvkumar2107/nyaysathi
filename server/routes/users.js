const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/users -> Admin/Internal search
// Should probably be restricted to admins in production
router.get('/', verifyToken, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }

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
  const users = await User.find(filter).limit(200).select("-password -otp");
  res.json(users);
});

// GET /api/users/public/:id - Get Public Profile of any user (usually lawyer)
router.get("/public/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -__v -otp -otpExpires -email -phone"); // Exclude private info

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/users/me - Secure Profile Update
router.put("/me", verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    // Prevent role change via this route
    delete updates.role;
    delete updates.password;

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// DELETE /api/users/me - Right to be Forgotten (DPDP Act 2023)
router.delete("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: Clean up other user data (messages, cases) if desired
    res.json({ success: true, message: "Account deleted permanently." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;
