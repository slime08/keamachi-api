// keamachi-api/lib/db.ts
import pkg from 'pg';

const { Pool } = pkg;

const connectionString = process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('SUPABASE_URL is not set');
}

// Supabase Postgres 用の接続プール
export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default { query };
