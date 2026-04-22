const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Contribution = require('../models/Contribution');
const { forecastRetirement, detectAnomalies } = require('../utils/ai');
const { contract } = require('../utils/blockchain');

// Add Contribution
router.post('/add', async (req, res) => {
    try {
        const { upid, employerId, amount, month, year } = req.body;
        
        // Generate payload hash for the smart contract
        const dataString = `${upid}-${employerId}-${amount}-${month}-${year}`;
        const contributionDataHash = crypto.createHash('sha256').update(dataString).digest('hex');

        let blockchainHash = '';
        if (contract) {
            try {
                // Send transaction to the real local hardhat node
                const tx = await contract.logContribution(upid, contributionDataHash);
                await tx.wait(); // Wait for confirmation
                blockchainHash = tx.hash;
                console.log(`Contribution logged to blockchain. TX Hash: ${blockchainHash}`);
            } catch (error) {
                console.error("Blockchain transaction failed:", error);
                return res.status(500).json({ message: "Blockchain transaction failed", error: error.message });
            }
        } else {
            console.warn("Blockchain contract not connected. Using mock hash.");
            blockchainHash = `0x${Math.random().toString(16).slice(2, 66)}`;
        }

        const contribution = new Contribution({
            upid,
            employerId,
            amount,
            month,
            year,
            blockchainHash,
            status: 'verified'
        });

        await contribution.save();
        res.status(201).json(contribution);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User Contributions & AI Insights
router.get('/:upid', async (req, res) => {
    try {
        const { upid } = req.params;
        const contributions = await Contribution.find({ upid }).sort({ month: -1 });
        
        // Get AI Insights
        const anomalies = detectAnomalies(contributions);
        
        // Mock current salary and age for forecasting (would normally be in user profile)
        const forecast = forecastRetirement(80000, contributions.reduce((acc, c) => acc + c.amount, 0), 30, 60);

        res.json({ contributions, anomalies, forecast });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Employer Trust Leaderboard
router.get('/leaderboard/scores', async (req, res) => {
    try {
        const allContributions = await Contribution.find({});
        
        // Aggregate scores by employer
        const leaderboard = {};
        allContributions.forEach(c => {
            if (!leaderboard[c.employerId]) {
                leaderboard[c.employerId] = { 
                    id: c.employerId, 
                    totalAmount: 0, 
                    count: 0,
                    lastSeen: c.year 
                };
            }
            leaderboard[c.employerId].totalAmount += c.amount;
            leaderboard[c.employerId].count += 1;
            if (parseInt(c.year) > parseInt(leaderboard[c.employerId].lastSeen)) {
                leaderboard[c.employerId].lastSeen = c.year;
            }
        });

        // Convert to array and calculate trust scores (mock logic for prototype)
        const scores = Object.values(leaderboard).map(emp => ({
            ...emp,
            trustScore: Math.min(100, (emp.count * 10) + (emp.totalAmount / 100000)),
            rating: emp.count > 5 ? 'Elite' : 'Verified'
        })).sort((a, b) => b.trustScore - a.trustScore);

        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
