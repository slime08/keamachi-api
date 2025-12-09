import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function health(request: VercelRequest, response: VercelResponse) {
  // CORSを許可
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエストへの対応
  if (request.method === 'OPTIONS') {
    return response.status(200).send('OK');
  }

  response.status(200).json({ status: 'API is running' });
}
