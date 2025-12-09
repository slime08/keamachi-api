import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS設定
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // クライアントのURLに合わせて調整してください
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // JSONボディをパースするためのミドルウェア

// ルーティングの例
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

app.get('/api/data', (req, res) => {
  res.status(200).json({ message: 'Hello from keamachi-api!' });
});

// Vercel Serverless Functionとしてエクスポート
export default app;
