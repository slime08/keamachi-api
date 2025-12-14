// keamachi-api/api/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const allowedOrigins = [
  'https://keamachi.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
];

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For local dev via curl or unknown origins, allow specific local dev origin or none
    if (origin === 'http://localhost:5173') {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
      // Allow requests without Origin header (e.g. curl)
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// /api (root) だけ応答する。/api/* はここで吸わない。
export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Vercel dev だと req.url が "/api" ではなく "/" になることがあるので両対応
  // 「余計なパスがついている場合は Not Found」を返して、他の関数に回す
  const url = req.url || '';
  // 例: "/" or "" → /api のroot扱い
  //     "/me" や "/facilities" → ここでは処理しない
  const isApiRoot = url === '/' || url === '';

  if (!isApiRoot) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }

  res.status(200).json({ message: 'keamachi-api root' });
}
