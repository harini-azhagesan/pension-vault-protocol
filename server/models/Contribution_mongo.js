const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
    upid: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // Format: YYYY-MM
    year: { type: Number, required: true },
    blockchainHash: { type: String },
    status: { type: String, enum: ['pending', 'verified', 'missing'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contribution', ContributionSchema);
