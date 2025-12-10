import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../lib/db'; // データベース接続をインポート

export default async function facilities(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  if (req.method === 'POST') {
    const { name, address, services } = req.body;

    if (!name || !address || !services) {
      return res.status(400).json({ error: 'Name, address, and services are required.' });
    }

    try {
      const result = await sql`
        INSERT INTO facilities (name, address, services)
        VALUES (${name}, ${address}, ${sql.array(services)})
        RETURNING id, name, address, services, created_at, updated_at;
      `;
      return res.status(201).json(result[0]); // 登録された事業所情報を返す
    } catch (error) {
      console.error('Error adding facility:', error);
      return res.status(500).json({ error: 'Failed to add facility.' });
    }
  }

  if (req.method === 'GET') {
    try {
      // データベースから実際の施設一覧データを取得
      const facilities = await sql`
        SELECT id, name, address, services, created_at, updated_at FROM facilities;
      `;
      return res.status(200).json(facilities);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return res.status(500).json({ error: 'Failed to fetch facilities.' });
    }
  }

  // GET, POST 以外のメソッドは許可しない
  res.status(405).json({ error: 'Method Not Allowed' });
}
