// keamachi-api/api/auth/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import supabase from '../../lib/supabaseServer'

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
    // curl など Origin が無い場合は許可（不要なら消してOK）
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

type LoginBody = {
  email?: string
  password?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res)

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) return res.status(500).json({ error: 'JWT_SECRET is not set on server' })

  try {
    const body = (req.body ?? {}) as LoginBody
    const email = (body.email ?? '').trim().toLowerCase()
    const password = body.password ?? ''

    if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

    // users テーブルから取得（最低限これだけあればOK）
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role, name')
      .eq('email', email)
      .maybeSingle()

    if (error) return res.status(500).json({ error: error.message })

    // セキュリティ的に「存在しない」と「違う」は同じ返しにする
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign(
      { userId: user.id, role: user.role ?? 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role ?? 'user',
        name: user.name ?? null,
      },
    })
  } catch (e) {
    return res.status(500).json({ error: String(e) })
  }
}
