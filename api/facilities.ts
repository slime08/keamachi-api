import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function facilities(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).send('OK');
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const dummyFacilities = [
    {
      "id": 1,
      "name": "サンシャイン福祉センター",
      "address": "東京都○○区××1-2-3",
      "services": ["訪問介護", "デイサービス"]
    },
    {
      "id": 2,
      "name": "ケアホーム山田",
      "address": "東京都○○区△△4-5-6",
      "services": ["グループホーム"]
    }
  ];

  res.status(200).json(dummyFacilities);
}