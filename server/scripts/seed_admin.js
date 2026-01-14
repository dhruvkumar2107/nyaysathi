const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const email = "admin@nyaysathi.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.findOneAndUpdate(
            { email },
            {
                name: "Super Admin",
                email,
                password: hashedPassword,
                role: "admin",
                plan: "diamond",
                verified: true,
            },
            { upsert: true, new: true }
        );

        console.log("✅ Admin User Created/Updated:");
        console.log("   Email: " + admin.email);
        console.log("   Password: " + password);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
