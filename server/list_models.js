const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: './.env' }); // Current dir .env

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("Using API Key:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) + "..." : "MISSING");

        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash-latest", "gemini-1.5-pro-latest"];

        for (const modelName of models) {
            console.log(`Checking ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("test");
                const response = await result.response;
                if (response.text()) {
                    console.log(`${modelName}: ✅ Success`);
                }
            } catch (e) {
                console.log(`${modelName}: ❌ Failed - ${e.message}`);
            }
        }
    } catch (err) {
        console.error("List Models Failed:", err.message);
    }
}

listModels();
