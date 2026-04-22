const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// --- Mongoose Schema Definition ---
const contributionSchema = new mongoose.Schema({
    upid: { type: String, required: true },
    employerId: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    blockchainHash: { type: String, required: true },
    status: { type: String, default: 'verified' },
    createdAt: { type: Date, default: Date.now }
});

let Contribution;
try {
    Contribution = mongoose.model('Contribution');
} catch {
    Contribution = mongoose.model('Contribution', contributionSchema);
}

// --- Hybrid Mock Implementation ---
const DB_FILE = path.join(__dirname, '../data/contributions.json');
let memoryContributions = [];

try {
    if (fs.existsSync(DB_FILE)) {
        memoryContributions = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
} catch (err) {
    console.log('Contribution Model: Using empty memory store');
}

class HybridContribution {
    constructor(data) {
        this.data = data;
        this.instance = (mongoose.connection.readyState === 1) 
            ? new Contribution(data) 
            : data;
    }

    async save() {
        if (mongoose.connection.readyState === 1) {
            return await this.instance.save();
        } else {
            const newItem = { 
                ...this.data, 
                _id: Date.now().toString(),
                createdAt: new Date() 
            };
            memoryContributions.push(newItem);
            
            try {
                if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
                    fs.writeFileSync(DB_FILE, JSON.stringify(memoryContributions, null, 2));
                }
            } catch (e) {}
            return newItem;
        }
    }
}

HybridContribution.find = (query = {}) => {
    if (mongoose.connection.readyState === 1) {
        // Return a query object that supports .sort()
        return Contribution.find(query);
    } else {
        const results = memoryContributions.filter(c => 
            Object.keys(query).every(key => String(c[key]) === String(query[key]))
        );
        
        return {
            sort: (sortObj) => {
                const key = Object.keys(sortObj)[0];
                const order = sortObj[key] === -1 ? -1 : 1;
                return results.sort((a, b) => {
                    if (a[key] < b[key]) return -1 * order;
                    if (a[key] > b[key]) return 1 * order;
                    return 0;
                });
            }
        };
    }
};

module.exports = HybridContribution;
