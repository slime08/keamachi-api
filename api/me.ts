// keamachi-api/api/me.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

const allowedOrigins = [
  'https://keamachi.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
]

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // curl等
    res.setHeader('Access-Control-Allow-Origin', '*')
  }

  // CORSはOriginで返す内容が変わるのでVary必須
  res.setHeader('Vary', 'Origin')

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res)

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' })

  // 認証系はキャッシュ無効（304を避けたい）
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  // 認証内容でレスポンスが変わるので明示（中間キャッシュ対策）
  res.setHeader('Vary', 'Origin, Authorization')

  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'Missing Bearer token' })

  const secret = process.env.JWT_SECRET
  if (!secret) return res.status(500).json({ error: 'JWT_SECRET is not set on server' })

  try {
    const decoded = jwt.verify(token, secret) as any

    // フロント側が安定する形に“整形して返す”
    const userId = decoded?.userId ?? decoded?.id
    const role = decoded?.role

    if (!userId || !role) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }

    return res.status(200).json({
      user: {
        userId,
        role,
        iat: decoded?.iat,
        exp: decoded?.exp,
      },
    })
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
