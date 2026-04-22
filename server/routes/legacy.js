const express = require('express');
const router = express.Router();
const { contract } = require('../utils/blockchain');

// Route: Set Heir
router.post('/set-heir', async (req, res) => {
    try {
        const { upid, heirAddress, timeoutSeconds } = req.body;
        
        if (!contract) {
            return res.status(500).json({ message: "Blockchain contract not connected" });
        }

        // Handle comma-separated list of addresses
        const heirList = heirAddress.split(',').map(addr => addr.trim()).filter(addr => addr !== '');

        const tx = await contract.setHeir(upid, heirList, timeoutSeconds || 31536000); 
        await tx.wait();

        res.status(200).json({ message: "Heirs successfully locked onto the blockchain", txHash: tx.hash });
    } catch (err) {
        console.error("Set Heir Error:", err);
        res.status(500).json({ message: "Failed to set heirs", error: err.reason || err.message });
    }
});

// Route: Ping Network
router.post('/ping', async (req, res) => {
    try {
        const { upid } = req.body;
        
        if (!contract) {
            return res.status(500).json({ message: "Blockchain contract not connected" });
        }

        const tx = await contract.pingProtocol(upid);
        await tx.wait();

        res.status(200).json({ message: "Ping successful. Safety timer reset & any pending claims cancelled.", txHash: tx.hash });
    } catch (err) {
        console.error("Ping Error:", err);
        res.status(500).json({ message: "Failed to ping the network", error: err.reason || err.message });
    }
});

// Route: Initiate Inheritance Claim
router.post('/claim-initiate', async (req, res) => {
    try {
        const { upid } = req.body;
        if (!contract) return res.status(500).json({ message: "Not connected" });

        const tx = await contract.claimInheritance(upid);
        await tx.wait();

        res.status(200).json({ message: "Inheritance claimed. 3-day safety buffer (Timelock) initiated.", txHash: tx.hash });
    } catch (err) {
        res.status(500).json({ message: "Failed to initiate claim", error: err.reason || err.message });
    }
});

// Route: Execute Inheritance (after timelock)
router.post('/claim-execute', async (req, res) => {
    try {
        const { upid } = req.body;
        if (!contract) return res.status(500).json({ message: "Not connected" });

        const tx = await contract.executeInheritance(upid);
        await tx.wait();

        res.status(200).json({ message: "Inheritance executed. Funds successfully transferred to heirs.", txHash: tx.hash });
    } catch (err) {
        res.status(500).json({ message: "Failed to execute claim", error: err.reason || err.message });
    }
});

// Route: Get Heir Info
router.get('/:upid', async (req, res) => {
    try {
        const { upid } = req.params;
        if (!contract) return res.status(500).json({ message: "Not connected" });

        const info = await contract.getHeirInfo(upid);
        // info returns: (address[] heirs, uint256 lastPing, uint256 timeoutPeriod, uint256 claimTimestamp, bool isDeceased)
        res.status(200).json({ 
            heirs: info[0],
            lastPing: info[1].toString(),
            timeoutPeriod: info[2].toString(),
            claimTimestamp: info[3].toString(),
            isDeceased: info[4]
         });
    } catch (err) {
        console.error("Get Heir Info Error:", err);
        res.status(500).json({ message: "Failed to fetch heir info", error: err.reason || err.message });
    }
});

module.exports = router;
