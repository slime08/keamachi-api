require('dotenv').config();
const express = require('express');
const supabase = require('./lib/supabaseServer');

const app = express();
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Simple server-side endpoint that returns rows from `users` table
// Uses SERVICE_ROLE_KEY (server only) so it can access privileged functions.
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(100);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Server-side endpoint: list facilities
app.get('/api/facilities', async (req, res) => {
  try {
    // Limit and offset can be added for pagination
    const { data, error } = await supabase.from('facilities').select('*').limit(100);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
