const express = require('express');
const router = express.Router();

// Mock AI Logic for Savings Advice
router.get('/savings-advice/:upid', async (req, res) => {
    const { upid } = req.params;
    
    // In a real app, we would fetch user contributions from MongoDB
    // and run a forecasting model. Here we simulate the AI logic.
    
    const advice = [
        {
            title: "Increase Contribution by 2%",
            description: "Based on your current salary growth, a 2% increase in monthly contributions could result in a 15% larger retirement corpus by age 60.",
            impact: "High",
            category: "Growth"
        },
        {
            title: "Lump Sum Opportunity",
            description: "You have a consistent surplus in your account. Consider a one-time voluntary contribution to benefit from compound interest.",
            impact: "Medium",
            category: "Stability"
        },
        {
            title: "Diversify Portfolio",
            description: "Your current pension fund is heavily weighted in low-risk bonds. Consider a slightly more aggressive equity allocation for better long-term returns.",
            impact: "Medium",
            category: "Management"
        }
    ];

    res.json({
        upid,
        generatedAt: new Date().toISOString(),
        advice: advice[Math.floor(Math.random() * advice.length)] // Return one random piece of advice for now
    });
});

// AI Chat Endpoint
router.post('/chat', async (req, res) => {
    const { message, upid } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided.' });

    const msg = message.toLowerCase();
    let reply = '';

    if (msg.includes('balance') || msg.includes('how much') || msg.includes('total')) {
        reply = `Your current recorded pension balance is ₹45,28,400 with a monthly contribution of ₹42,000. You're on track with a retirement readiness of 84%.`;
    } else if (msg.includes('contribution') || msg.includes('payment') || msg.includes('deposit')) {
        reply = `Contributions are logged every month by your employer and hashed on the blockchain. You can view the full timeline on the Overview tab. If a contribution is missing, it will be flagged as an anomaly.`;
    } else if (msg.includes('blockchain') || msg.includes('verify') || msg.includes('hash')) {
        reply = `Every contribution is cryptographically hashed using SHA-256 and recorded on the Ethereum VM. Click "Verify Trust" on the dashboard to run a live Merkle-root verification against 14,200 nodes.`;
    } else if (msg.includes('retire') || msg.includes('forecast') || msg.includes('corpus') || msg.includes('goal')) {
        reply = `Based on your current salary and contribution rate, you are projected to reach a corpus of ₹1.4 Crore by age 60. Use the Retirement Simulator in the AI Insights tab to adjust your parameters.`;
    } else if (msg.includes('heir') || msg.includes('legacy') || msg.includes('nominee') || msg.includes('inherit')) {
        reply = `You can set up a Legacy Plan from the "Legacy Plan" tab. A smart contract will automatically release your funds to your nominated heirs after a configurable timeout period if you stop pinging the protocol.`;
    } else if (msg.includes('employer') || msg.includes('trust') || msg.includes('company') || msg.includes('leaderboard')) {
        reply = `The Employer Trust Leaderboard ranks employers by their contribution consistency and total amount paid. Employers with 5+ contributions are rated "Elite". You can see the full ranking under the "Employer Trust" tab.`;
    } else if (msg.includes('download') || msg.includes('pdf') || msg.includes('statement') || msg.includes('report')) {
        reply = `Click "Download Statement" in the top-right of your dashboard to generate a blockchain-verified PDF report of all your contributions, complete with hashes and digital signature.`;
    } else if (msg.includes('password') || msg.includes('login') || msg.includes('account') || msg.includes('security')) {
        reply = `Your account uses bcrypt-hashed passwords with JWT-based session tokens. Blockchain MFA is enabled by default. For password resets, please contact your organization admin.`;
    } else if (msg.includes('upid') || msg.includes('vault id') || msg.includes('id')) {
        reply = `Your Universal Pension ID (UPID) is a lifelong identifier like '${upid || 'UPL-2026-XXXX'}' that works across all employers. It is the primary key for all your blockchain-logged contributions.`;
    } else if (msg.includes('help') || msg.includes('what can you') || msg.includes('hi') || msg.includes('hello')) {
        reply = `Hello! I'm the PensionVault AI Assistant. I can help you with:\n• Contribution history & balance\n• Blockchain verification\n• Retirement forecasting\n• Legacy & heir planning\n• Employer trust scores\n• PDF statement downloads\n\nWhat would you like to know?`;
    } else {
        reply = `That's a great question! As your AI Pension Advisor, I can help you with contributions, blockchain verification, retirement projections, legacy planning, and employer trust scores. Could you rephrase or ask about one of these topics?`;
    }

    res.json({ reply, timestamp: new Date().toISOString() });
});

module.exports = router;

