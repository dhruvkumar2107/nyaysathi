const fetch = require('node-fetch');
require("dotenv").config({ path: './.env' });

async function testRest() {
    const key = process.env.GEMINI_API_KEY;
    const models = ["gemini-pro-latest", "gemini-flash-latest", "gemini-1.5-flash", "gemini-2.5-pro"];

    for (const modelName of models) {
        console.log(`📡 Testing REST API for ${modelName}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello" }] }]
                })
            });
            const data = await response.json();

            if (data.error) {
                console.log(`❌ ${modelName} Error: ${data.error.message}`);
                console.log(`   Detailed error:`, JSON.stringify(data.error));
            } else {
                console.log(`✅ ${modelName} OK!`);
                console.log(`   Response text: ${data.candidates[0].content.parts[0].text}`);
                process.exit(0); // Exit if one works
            }
        } catch (e) {
            console.error(`❌ ${modelName} Fetch Exception:`, e.message);
        }
    }
}

testRest();
