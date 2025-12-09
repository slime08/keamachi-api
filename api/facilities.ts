import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function facilities(request: VercelRequest, response: VercelResponse) {
  // CORSを許可
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストへの対応
  if (request.method === 'OPTIONS') {
    return response.status(200).send('OK');
  }

  // ダミーの施設一覧データ
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

  response.status(200).json(dummyFacilities);
}
