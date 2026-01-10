require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fs = require('fs');
const path = require('path');

function log(msg) {
    console.log(msg);
    fs.appendFileSync(path.join(__dirname, 'gemini_log.txt'), msg + '\n');
}

async function check() {
    fs.writeFileSync(path.join(__dirname, 'gemini_log.txt'), "--- DIAGNOSTIC LOG STARTED ---\n");

    log("Checking Environment...");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        log("❌ ERROR: No API KEY found in process.env");
        return;
    }
    log(`API Key found. Length: ${key.length}`);
    log(`API Key starts with: ${key.substring(0, 4)}`);

    const genAI = new GoogleGenerativeAI(key);
    const modelName = "gemini-1.5-flash";
    log(`\nAttempting to connect to model: ${modelName}`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Test connection");
        const response = await result.response;
        log(`✅ SUCCESS! Response: ${response.text()}`);
    } catch (error) {
        log(`❌ FAILED with error: ${error.message}`);
        if (error.message.includes("404")) {
            log("   -> CONFIRMED: 404 Not Found. The Key cannot access this model.");
        }
    }
    log("--- DIAGNOSTIC LOG ENDED ---");
}

check();
