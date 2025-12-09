import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function health(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  res.status(200).json({ status: 'API is running' });
}