import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config(); // .envファイルを読み込む

// Vercel PostgreSQLアドオンから提供される接続URL
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Environment variable POSTGRES_URL is not set.');
  process.exit(1);
}

// データベース接続インスタンスを作成
const sql = postgres(connectionString, {
  ssl: 'require', // Vercel PostgreSQL は SSL 接続を必須とします
  max: 1 // Vercel Serverless Functions の性質上、コネクションプールは小さく保つ
});

export default sql;
