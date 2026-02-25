const User = require("../models/User");

const checkAiLimit = async (req, res, next) => {
    try {
        // Allow Guests (Limit handled by Frontend/RateLimiter)
        if (!req.userId) {
            return next();
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // Attach user to request

        // Defined Limits
        let LIMIT = 50; // Increased for development/production transition
        if (user.plan === 'silver') LIMIT = 100;
        else if (['gold', 'diamond'].includes(user.plan)) LIMIT = Infinity;

        // Check if locked
        if (user.aiUsage.count >= LIMIT) {
            return res.status(403).json({
                error: `Plan Limit Reached (${user.aiUsage.count}/${LIMIT}). Upgrade for more!`,
                code: "LIMIT_REACHED"
            });
        }

        // Removed buggy trial period logic causing ReferenceError

        // If allowed, we need to track this usage. 
        // We'll attach a function to req that the route handler can call to increment count.
        // OR better, we increment here? 
        // If we increment here, even failed AI calls might count. 
        // But for simplicity and security, let's increment here.
        // Wait, if it fails, we shouldn't count. 
        // Let's increment NOW. If the AI service fails, it's a consumed token anyway in most systems.

        if (user.aiUsage.count === 0 && !user.aiUsage.firstUsedAt) {
            user.aiUsage.firstUsedAt = new Date();
        }
        user.aiUsage.count += 1;
        await user.save();

        next();
    } catch (err) {
        console.error("AI Limit Check Error:", err);
        res.status(500).json({ error: "Server error checking limits" });
    }
};

module.exports = checkAiLimit;
