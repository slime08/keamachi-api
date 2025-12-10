// keamachi-api/api/dbtest.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const url = process.env.SUPABASE_URL || null;

  res.status(200).json({
    hasSupabaseUrl: !!url,
    // 中身全部見せるのは危険なので先頭だけ
    supabaseUrlPrefix: url ? url.slice(0, 40) : null,
    nodeEnv: process.env.NODE_ENV || null,
  });
}
