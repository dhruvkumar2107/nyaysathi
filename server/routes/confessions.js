const express = require("express");
const router = express.Router();
const Confession = require("../models/Confession");
const verifyToken = require("../middleware/authMiddleware");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "missing_key");

// Helper: AI preliminary analysis
async function getAIAnalysis(title, body, category) {
    const prompt = `You are NyayNow, a Senior Supreme Court Advocate. A person posted an ANONYMOUS legal issue. Give a concise, structured preliminary legal analysis.

CATEGORY: ${category}
TITLE: ${title}
ISSUE: ${body}

Respond in this exact format (short and punchy, max 200 words):

**Legal Posture:** [One sentence on their legal standing]

**Applicable Laws:** [List 2-3 specific Indian law sections]

**Immediate Steps:**
1. [Action 1]
2. [Action 2]  
3. [Action 3]

**Risk Level:** [Low / Medium / High] — [one sentence reason]

Keep it practical, cite actual section numbers, no fluff.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        return "Our AI is currently unavailable. A lawyer from the community will respond shortly.";
    }
}

/* ─────────────── GET ALL CONFESSIONS ─────────────── */
// Public feed — strips author info completely
router.get("/", async (req, res) => {
    try {
        const { category, status, sort = "new" } = req.query;
        const filter = {};
        if (category && category !== "All") filter.category = category;
        if (status) filter.status = status;

        const sortField = sort === "top" ? { "upvotes": -1 } : { createdAt: -1 };

        const confessions = await Confession.find(filter)
            .select("-_authorId") // Never expose author
            .sort(sortField)
            .limit(50)
            .populate("replies.responderId", "name role specialization profileImage")
            .lean();

        // Sanitize: replace responder names for anonymity hint, keep lawyer badge
        const sanitized = confessions.map(c => ({
            ...c,
            replies: c.replies.map(r => ({
                ...r,
                responderName: r.responderRole === "ai"
                    ? "NyayNow AI"
                    : r.responderRole === "lawyer"
                        ? `Adv. ${r.responderId?.specialization || "Legal Expert"}`
                        : "Community Member",
                responderId: undefined // strip ID from response
            }))
        }));

        res.json(sanitized);
    } catch (err) {
        console.error("Confessions GET error:", err);
        res.status(500).json({ error: "Failed to fetch confessions" });
    }
});

/* ─────────────── POST NEW CONFESSION ─────────────── */
router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, body, category, tags } = req.body;
        if (!title || !body) return res.status(400).json({ error: "Title and body are required" });

        // Create confession (anonymous)
        const confession = new Confession({
            title,
            body,
            category: category || "Other",
            tags: tags || [],
            _authorId: req.user.id, // stored but not exposed
        });

        // Get AI analysis async (non-blocking save)
        const saved = await confession.save();

        // Fire AI analysis and update
        getAIAnalysis(title, body, category).then(async (analysis) => {
            await Confession.findByIdAndUpdate(saved._id, {
                $push: {
                    replies: {
                        responderRole: "ai",
                        text: analysis,
                        responderId: null,
                        createdAt: new Date()
                    }
                },
                aiAnalysis: analysis
            });
        });

        res.status(201).json({ _id: saved._id, message: "Posted anonymously. AI analysis incoming." });
    } catch (err) {
        console.error("Confession POST error:", err);
        res.status(500).json({ error: "Failed to post confession" });
    }
});

/* ─────────────── ADD REPLY ─────────────── */
router.post("/:id/reply", verifyToken, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text?.trim()) return res.status(400).json({ error: "Reply text required" });

        const confession = await Confession.findById(req.params.id);
        if (!confession) return res.status(404).json({ error: "Not found" });

        confession.replies.push({
            responderId: req.user.id,
            responderRole: req.user.role || "client",
            text: text.trim()
        });

        await confession.save();
        res.json({ message: "Reply added" });
    } catch (err) {
        console.error("Reply error:", err);
        res.status(500).json({ error: "Failed to add reply" });
    }
});

/* ─────────────── UPVOTE CONFESSION ─────────────── */
router.post("/:id/upvote", verifyToken, async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        if (!confession) return res.status(404).json({ error: "Not found" });

        const uid = req.user.id;
        const alreadyUpvoted = confession.upvotes.some(id => id.toString() === uid);

        if (alreadyUpvoted) {
            confession.upvotes = confession.upvotes.filter(id => id.toString() !== uid);
        } else {
            confession.upvotes.push(uid);
        }

        await confession.save();
        res.json({ upvotes: confession.upvotes.length, upvoted: !alreadyUpvoted });
    } catch (err) {
        res.status(500).json({ error: "Upvote failed" });
    }
});

/* ─────────────── MARK HELPFU reply ─────────────── */
router.post("/:id/reply/:replyId/helpful", verifyToken, async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        if (!confession) return res.status(404).json({ error: "Not found" });

        const reply = confession.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ error: "Reply not found" });

        const uid = req.user.id;
        const idx = reply.helpful.indexOf(uid);
        if (idx === -1) reply.helpful.push(uid);
        else reply.helpful.splice(idx, 1);

        await confession.save();
        res.json({ helpful: reply.helpful.length });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

/* ─────────────── MARK RESOLVED ─────────────── */
router.patch("/:id/resolve", verifyToken, async (req, res) => {
    try {
        await Confession.findByIdAndUpdate(req.params.id, { status: "resolved" });
        res.json({ message: "Marked as resolved" });
    } catch (err) {
        res.status(500).json({ error: "Failed" });
    }
});

module.exports = router;
