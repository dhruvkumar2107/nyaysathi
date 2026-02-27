const axios = require('axios');

async function testAssistant() {
    try {
        console.log("Testing AI Assistant endpoint...");
        const response = await axios.post('http://localhost:4000/api/ai/assistant', {
            question: "What is the penalty for theft under BNS 2024?",
            language: "English",
            location: "Mumbai"
        });
        console.log("Response Status:", response.status);
        console.log("AI Response:", response.data.answer.substring(0, 100) + "...");
    } catch (err) {
        console.error("Test Failed:", err.response?.data || err.message);
    }
}

testAssistant();
