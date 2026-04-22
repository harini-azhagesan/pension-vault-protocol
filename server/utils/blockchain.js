const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const contractDataPath = path.join(__dirname, 'contract.json');
let contract = null;

if (fs.existsSync(contractDataPath)) {
    const contractData = JSON.parse(fs.readFileSync(contractDataPath, 'utf8'));
    
    // Connect to local node
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
    
    // Use private key from .env (fallback to hardhat account 0 for testing)
    const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const wallet = new ethers.Wallet(privateKey, provider);
    
    contract = new ethers.Contract(contractData.address, contractData.abi, wallet);
} else {
    console.warn("contract.json not found in server/utils. Blockchain features will not work.");
}

module.exports = { contract };
