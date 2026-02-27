const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

const DEFAULT_SYSTEM_PROMPT = `You are 'NyayNow', an elite Senior Supreme Court Advocate and Legal Intelligence Engine in India.

YOUR MISSION: To provide bulletproof, citation-backed legal intelligence while strictly avoiding the "Unauthorized Practice of Law" by clarifying that you provide information, not legal advice for court filing.

LEGAL GROUNDING (2024 STANDARDS):
- Primary Law: **Bharatiya Nyaya Sanhita (BNS)**, **BNSS**, and **BSA** (replacing IPC, CrPC, and IEA).
- Always prioritize BNS 2024 over IPC 1860 unless the user specifically asks about an older case.
- Grounded in the **Constitution of India**.

ELITE RULES OF ENGAGEMENT:
1. **FACT-GATING**: Before providing an opinion, you MUST extract and summarize the "Legal Facts" from the user's query.
2. **CITATION-ONLY RULE**: You are FORBIDDEN from making a legal claim without a specific Section or Article citation (e.g., "Under Section 302 of BNS...").
3. **HALLUCINATION BLOCK**: If you are unsure of the specific section or law, you MUST state "A specific section reference is required here, consult a NyayNow verified lawyer" rather than guessing.
4. **BNS vs IPC CROSS-REF**: When citing a new BNS section, briefly mention its IPC equivalent for user clarity (e.g., "Section 103 BNS (Formerly Sec 302 IPC)").
5. **NO GENERIC FLUFF**: Avoid saying "The law is a complex web...". Be sharp, incisive, and direct.

TONE: Elite, Authoritative, Strategically minded, and Decisive.`;

/**
 * Centrally managed AI generation with fallback logic.
 * @param {string} prompt - The user query or structured prompt.
 * @param {string} systemInstruction - Optional custom system instructions.
 * @returns {Promise<any>} - The Gemini result object.
 */
async function generateWithFallback(prompt, systemInstruction = DEFAULT_SYSTEM_PROMPT) {
    const modelsToTry = [
        "gemini-1.5-flash",    // High-performance, higher free quota
        "gemini-1.5-pro",      // Primary Power Model
        "gemini-2.0-flash-exp" // Experimental fallback
    ];

    const errors = [];
    for (const modelName of modelsToTry) {
        try {
            console.log(`🤖 Attempting GenAI with ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const chatResult = await model.generateContent(prompt);
            const response = await chatResult.response;

            // Safety Check: If blocked by safety filters, response.text() throws
            if (response.candidates && response.candidates.length > 0) {
                console.log(`✅ Success with ${modelName}`);
                return chatResult;
            } else {
                throw new Error("Response blocked by safety filters or no candidates returned.");
            }
        } catch (err) {
            console.error(`❌ Error with ${modelName}:`, err.message);
            errors.push(`${modelName}: ${err.message}`);

            // If it's the last model, throw consolidated error
            if (modelName === modelsToTry[modelsToTry.length - 1]) {
                throw new Error(`AI Service Unavailable: ${errors.join(" | ")}`);
            }
        }
    }
}

/**
 * Centrally managed AI generation for Vision/Multimodal.
 * @param {Array} parts - Array containing text and inlineData for images.
 * @returns {Promise<any>}
 */
async function generateMultimodalWithFallback(parts) {
    const modelsToTry = [
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-2.0-flash-exp"
    ];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(parts);
            if (result && result.response) return result;
        } catch (err) {
            console.error(`Multimodal Error with ${modelName}:`, err.message);
            if (modelName === modelsToTry[modelsToTry.length - 1]) throw err;
        }
    }
}

module.exports = {
    generateWithFallback,
    generateMultimodalWithFallback,
    DEFAULT_SYSTEM_PROMPT
};
