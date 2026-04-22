const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/contributions.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Initialize contributions file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const ContributionSchema = {
    find: (query) => {
        const contributions = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (!query) return { sort: () => contributions };
        const results = contributions.filter(c => Object.keys(query).every(key => c[key] === query[key]));
        return {
            sort: (sortObj) => {
                // simple sort mockup
                const key = Object.keys(sortObj)[0];
                const order = sortObj[key] === -1 ? -1 : 1;
                return results.sort((a, b) => {
                    if (a[key] < b[key]) return -1 * order;
                    if (a[key] > b[key]) return 1 * order;
                    return 0;
                });
            }
        };
    },
    save: (contribution) => {
        const contributions = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        contributions.push(contribution);
        fs.writeFileSync(DB_FILE, JSON.stringify(contributions, null, 2));
        return contribution;
    }
};

class MockContribution {
    constructor(data) {
        Object.assign(this, data);
        this._id = Date.now().toString();
        this.createdAt = new Date().toISOString();
    }
    async save() {
        return ContributionSchema.save(this);
    }
}

MockContribution.find = (query) => ContributionSchema.find(query);

module.exports = MockContribution;
