const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* ---------------- GET ALL LAWYERS ---------------- */
router.get("/", async (req, res) => {
    try {
        // 1. Fetch only lawyers
        // 2. Ideally, we should add pagination, but for now fetch all
        const lawyers = await User.find({ role: "lawyer" })
            .select("-password") // Exclude password from results
            .limit(50); // Safety limit

        res.json(lawyers);
    } catch (err) {
        console.error("Error fetching lawyers:", err.message);
        res.status(500).json({ error: "Failed to fetch lawyers" });
    }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

/* ---------------- VERIFY ID (OCR) ---------------- */
router.post("/verify-id", async (req, res) => {
    try {
        const { userId, imageUrl } = req.body;
        if (!userId || !imageUrl) return res.status(400).json({ error: "Missing data" });

        // 1. Fetch Image
        let imageBuffer;
        if (imageUrl.startsWith("http")) {
            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
            imageBuffer = Buffer.from(response.data);
        } else {
            // Local file (fallback)
            const fs = require("fs");
            const path = require("path");
            try {
                // Remove leading slash if present for local path join
                const relativePath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
                const fullPath = path.join(__dirname, "..", relativePath);
                imageBuffer = fs.readFileSync(fullPath);
            } catch (e) {
                console.error("Local file read error:", e);
                return res.status(400).json({ error: "Could not read image file" });
            }
        }

        // 2. Prepare Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "This is an image of a Lawyer's Bar Council ID Card. Analyze it. 1. Is this a valid Indian Bar Council ID? 2. Extract the Name. 3. Return JSON: { valid: boolean, name: string, reason: string }";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBuffer.toString("base64"),
                    mimeType: "image/jpeg", // Assuming JPEG/PNG
                },
            },
        ]);

        const responseText = await result.response.text();
        console.log("Raw Gemini OCR Response:", responseText);

        // 3. Parse JSON
        let text = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }

        const data = JSON.parse(text);

        // 4. Update User
        if (data.valid) {
            await User.findByIdAndUpdate(userId, { verified: true });
        }

        res.json(data);

    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ error: "Verification process failed" });
    }
});

module.exports = router;
