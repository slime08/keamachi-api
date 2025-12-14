// keamachi-api/server.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('./lib/supabaseServer');

const app = express();

/**
 * =====================
 * 304対策（最優先）
 * =====================
 */
// ★ ETag を無効化（If-None-Match → 304 を止める）
app.set('etag', false);

// JSON
app.use(express.json());

/**
 * =====================
 * CORS（ローカル + 本番）
 * =====================
 */
const allowedOrigins = new Set([
  'https://keamachi.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // curl等
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // 認証/Originでレスポンスが変わるのでVaryを入れる
  res.setHeader('Vary', 'Origin, Authorization');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

/**
 * =====================
 * API は常に no-store（キャッシュさせない）
 * =====================
 */
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

/**
 * =====================
 * auth middleware
 * =====================
 */
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'JWT_SECRET is not set on server' });

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * =====================
 * routes
 * =====================
 */
app.get('/api/ping', (req, res) => res.json({ ok: true }));

/**
 * ★ AuthProviderが叩く想定：/api/me
 * - フロント側が期待する形に整形して返す
 *   { user: { userId, role, iat, exp } }
 */
app.get('/api/me', authRequired, (req, res) => {
  // payload例: { id, userId, email, name, role, iat, exp ... } を想定
  const p = req.user || {};

  const userId = p.userId ?? p.id;  // どっちでも受ける
  const role = p.role;

  if (!userId || !role) {
    return res.status(401).json({ error: 'Invalid token payload' });
  }

  return res.json({
    user: {
      userId,
      role,
      iat: p.iat,
      exp: p.exp,
    },
  });
});

// users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(100);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// facilities
app.get('/api/facilities', async (req, res) => {
  try {
    const { data, error } = await supabase.from('facilities').select('*').limit(100);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
