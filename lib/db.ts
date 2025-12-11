// keamachi-api/lib/db.ts
import postgres from 'postgres';

const connectionString = process.env.SUPABASE_URL;

if (!connectionString) {
  throw new Error('SUPABASE_URL is not set');
}

// Supabase Postgres client using 'postgres' library (supports tagged template literals)
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }, // For Supabase, usually needed
});

// Export the sql function directly so migration files can use it as tagged template literal
export default sql;

// For other parts of the API that might need a direct query function,
// we can also export a query wrapper if needed, but 'sql' itself can be used directly.
export const query = sql;
