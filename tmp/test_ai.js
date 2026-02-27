require("dotenv").config();
const { generateWithFallback } = require("./server/utils/aiUtils");

async function test() {
    console.log("🚀 Starting AI Connection Test...");
    try {
        const result = await generateWithFallback("Say hello!");
        const response = await result.response;
        console.log("✅ AI Response:", response.text());
    } catch (err) {
        console.error("❌ AI Test Failed:", err.message);
        if (err.stack) console.error(err.stack);
    }
}

test();
