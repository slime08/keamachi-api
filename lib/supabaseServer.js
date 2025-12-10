const { createClient } = require('@supabase/supabase-js');

// Use SUPABASE_PROJECT_URL (HTTP(S) form) if provided, otherwise fall back to SUPABASE_URL
const supabaseUrl = process.env.SUPABASE_PROJECT_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: SUPABASE_PROJECT_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY must be set. Check .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
