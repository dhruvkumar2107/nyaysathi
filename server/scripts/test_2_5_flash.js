const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

function log(msg) {
    console.log(msg);
    fs.appendFileSync(path.join(__dirname, 'trace_2_5.txt'), msg + '\n');
}

async function test() {
    fs.writeFileSync(path.join(__dirname, 'trace_2_5.txt'), "--- START ---\n");
    log("Testing 'gemini-2.5-flash'...");

    // Hardcode path to .env for reliability
    require("dotenv").config({ path: path.join(__dirname, '../.env') });

    if (!process.env.GEMINI_API_KEY) {
        log("❌ No API Key found");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent("Hello");
        const response = await result.response;
        log("✅ Success! Model exists.");
        log("Response: " + response.text());
    } catch (error) {
        log("❌ Failed!");
        log("Error Message: " + error.message);
        if (error.message.includes("404")) {
            log("👉 CONCLUSION: 'gemini-2.5-flash' is NOT a valid model name.");
        }
    }
}

test();
