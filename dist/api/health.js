"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = health;
const allowedOrigins = [
    'https://keamachi.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
];
function health(req, res) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    else {
        // For local dev via curl or unknown origins, allow specific local dev origin or none
        if (origin === 'http://localhost:5173') { // Fallback for specific local dev if not in allowedOrigins array
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        else if (!origin) { // Allow requests without Origin header (e.g. curl)
            res.setHeader('Access-Control-Allow-Origin', '*'); // Or just omit header if not needed
        }
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Added Authorization header
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }
    res.status(200).json({ status: 'ok' });
}
