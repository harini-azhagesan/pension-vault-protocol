const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow CORS for deployment
app.use(cors({
  origin: '*', // Allows requests from any deployment URL (Vercel, Netlify, etc.)
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && process.env.NODE_ENV === 'production') {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Production MongoDB Connected'))
        .catch(err => console.log('MongoDB connection error:', err));
} else {
    console.log('Running in Prototype/Development Mode: Data stored locally');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contributions', require('./routes/contributions'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/legacy', require('./routes/legacy'));

app.get('/', (req, res) => {
    res.send('Universal Pension Ledger API is running...');
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
