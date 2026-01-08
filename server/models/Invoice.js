const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
