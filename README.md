# 🏛️ PensionVault — Blockchain-Verified Pension Protocol

> A next-generation pension management system powered by blockchain verification, AI insights, and smart-contract security.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)
[![Ethereum](https://img.shields.io/badge/Ethereum-Hardhat-orange.svg)](https://hardhat.org)

---

## ✨ Features

-  Universal Vault ID (UPID)** — A lifelong pension identifier that follows you across all employers
-  Blockchain Contribution Logging** — Every contribution is SHA-256 hashed and recorded on an Ethereum VM via Hardhat
-  AI Retirement Advisor** — Personalized savings advice, anomaly detection, and retirement corpus forecasting
-  Contribution Heatmap** — GitHub-style activity calendar showing 12 months of contribution history
-  PDF Statement with QR Verification** — Download a cryptographically-verified PDF with an embedded QR code for on-chain proof
-  Employer Trust Leaderboard** — Ranks employers by contribution consistency and total amount
-  Legacy Plan** — Smart-contract based heir management with configurable timeout release
-  Live AI Chat Support** — Real-time Q&A with an AI pension advisor

---

## Project Structure

```
pension/
├── client/          # React + Vite + Tailwind CSS frontend
│   └── src/
│       ├── pages/       # Dashboard, Login, Signup, Landing, etc.
│       └── components/  # AICopilot, HeatMap, LegacySettings, etc.
├── server/          # Express.js backend API
│   ├── routes/      # auth, contributions, ai, legacy
│   ├── models/      # User, Contribution (Mongoose)
│   └── utils/       # blockchain.js, ai.js
└── blockchain/      # Hardhat smart contracts
    └── contracts/   # PensionLedger.sol
```

---

##  Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/pension-vault-protocol.git
cd pension-vault-protocol
```

### 2. Setup the Server
```bash
cd server
npm install
# Create a .env file (see .env.example)
node index.js
```

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```

### 4. (Optional) Start Hardhat Node
```bash
cd blockchain
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pensionvault
JWT_SECRET=your_secret_here
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_hardhat_private_key
```

> ⚠️ **Never commit your `.env` file.** It is already excluded via `.gitignore`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion |
| Backend | Express.js, Node.js, JWT, bcryptjs |
| Database | MongoDB (Mongoose) with local JSON fallback |
| Blockchain | Hardhat, Solidity, Ethers.js |
| AI | Rule-based advisor (Gemini-ready) |
| PDF | jsPDF + jspdf-autotable + QRCode |

---

## 📜 License

MIT © 2026 Harini — PensionVault Protocol
