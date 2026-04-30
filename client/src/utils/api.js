import axios from 'axios';

// Central API configuration
// Uses VITE_API_URL from .env if set, otherwise falls back to:
// - In development: http://localhost:5000
// - In production: same domain (relative path)
const API_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.DEV ? 'http://localhost:5000' : '');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
