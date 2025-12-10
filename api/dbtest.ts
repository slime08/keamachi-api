// keamachi-api/api/dbtest.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await sql`SELECT NOW();`;
    
    res.status(200).json({
      success: true,
      message: "Connected to Supabase!",
      result
    });
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({
      success: false,
      error: String(error)
    });
  }
}
