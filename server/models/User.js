const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const UserSchema = {
    find: (query) => {
        const users = JSON.parse(fs.readFileSync(DB_FILE));
        if (!query) return users;
        return users.filter(u => Object.keys(query).every(key => u[key] === query[key]));
    },
    findOne: (query) => {
        const users = JSON.parse(fs.readFileSync(DB_FILE));
        return users.find(u => Object.keys(query).every(key => u[key] === query[key]));
    },
    save: (user) => {
        const users = JSON.parse(fs.readFileSync(DB_FILE));
        users.push(user);
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
        return user;
    }
};

// Mock the Mongoose model behavior
class MockUser {
    constructor(data) {
        Object.assign(this, data);
        this._id = Date.now().toString();
    }
    async save() {
        return UserSchema.save(this);
    }
}

MockUser.findOne = async (query) => UserSchema.findOne(query);
MockUser.find = async (query) => UserSchema.find(query);

module.exports = MockUser;
