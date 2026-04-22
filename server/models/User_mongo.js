const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    upid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'employer'], default: 'employee' },
    organization: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
