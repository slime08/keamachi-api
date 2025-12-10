// keamachi-api/api/facilities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from '../lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  // 施設一覧（GET）
  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT id, name, description, location, service_type, phone
         FROM facilities
         ORDER BY id`
      );

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return res.status(500).json({
        error: 'Failed to fetch facilities',
        detail: String(error),
      });
    }
  }

  // 必要なら POST もここに追加できる（いったん省略でもOK）

  return res.status(405).json({ error: 'Method Not Allowed' });
}
