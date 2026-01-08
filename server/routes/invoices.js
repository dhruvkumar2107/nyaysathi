const router = require("express").Router();
const Invoice = require("../models/Invoice");

// Create Invoice
router.post("/", async (req, res) => {
    try {
        const newInv = new Invoice(req.body);
        await newInv.save();
        res.json(newInv);
    } catch (err) {
        res.status(500).json({ error: "Failed to create invoice" });
    }
});

// Get Invoices for a Lawyer
router.get("/", async (req, res) => {
    try {
        const invoices = await Invoice.find({ lawyerId: req.query.lawyerId }).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
});

// Update Invoice
router.put("/:id", async (req, res) => {
    try {
        const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update" });
    }
});

module.exports = router;
