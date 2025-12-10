// keamachi-api/api/facilities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ---- Supabase HTTP クライアント作成 ----
const supabaseUrl = process.env.SUPABASE_HTTP_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_HTTP_URL or SUPABASE_ANON_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---- ハンドラ ----
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('id, name, description, location, service_type, phone')
        .order('id', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({
          error: 'Failed to fetch facilities from Supabase',
          detail: String(error.message),
        });
      }

      return res.status(200).json(data ?? []);
    } catch (e) {
      console.error('Unexpected error in /api/facilities:', e);
      return res.status(500).json({
        error: 'Failed to fetch facilities',
        detail: String(e),
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
