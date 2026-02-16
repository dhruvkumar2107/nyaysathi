const axios = require('axios');

async function testAI() {
    try {
        console.log("Testing AI Assistant with query: 'Hi'");
        const res1 = await axios.post('http://localhost:4000/api/ai/assistant', {
            question: "Hi",
            location: "Mumbai",
            language: "English"
        });
        console.log("Response 1:", res1.data.answer);

        console.log("\nTesting AI Assistant with query: 'What is Section 302 related to?'");
        const res2 = await axios.post('http://localhost:4000/api/ai/assistant', {
            question: "What is Section 302 related to?",
            location: "Delhi",
            language: "English"
        });
        console.log("Response 2:", res2.data.answer);

    } catch (err) {
        console.error("Test Failed:", err.message);
        if (err.response) console.error("Response:", err.response.data);
    }
}

testAI();
