const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: './server/.env' });

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: The newer SDK might not have a direct listModels on genAI, but we can try 
        // Or check documentation. Usually it's via the fetch API or a specific client.
        console.log("Using API Key:", process.env.GEMINI_API_KEY.substring(0, 5) + "...");

        // Let's just try to hit a very common and guaranteed model name "gemini-1.0-pro"
        // and "gemini-1.5-flash" again but with different names.

        console.log("Checking gemini-1.5-flash-latest...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent("test");
            console.log("gemini-1.5-flash-latest: Success");
        } catch (e) {
            console.log("gemini-1.5-flash-latest: Failed -", e.message);
        }

        console.log("Checking gemini-1.5-flash...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("test");
            console.log("gemini-1.5-flash: Success");
        } catch (e) {
            console.log("gemini-1.5-flash: Failed -", e.message);
        }
    } catch (err) {
        console.error("List Models Failed:", err.message);
    }
}

listModels();
