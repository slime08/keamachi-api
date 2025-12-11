const { createClient } = require('@supabase/supabase-js');

// Use SUPABASE_PROJECT_URL (HTTP(S) form) if provided, otherwise fall back to SUPABASE_URL
const supabaseUrl = process.env.SUPABASE_URL; // Standardized on SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Supabase URL or Service Role Key is missing. Check keamachi-api/.env'); // Changed to error for visibility
} else {
  console.log('Supabase URL (partial):', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'N/A'); // Log partial URL
  console.log('Supabase Service Role Key (present):', !!supabaseKey); // Log if key is present (don't log actual key)
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
