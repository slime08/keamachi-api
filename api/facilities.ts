// keamachi-api/api/facilities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ---- Supabase HTTP 繧ｯ繝ｩ繧､繧｢繝ｳ繝・----
const supabaseUrl = process.env.SUPABASE_HTTP_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_HTTP_URL or SUPABASE_ANON_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 荳隕ｧ逕ｨ縺ｮ繝輔か繝ｼ繝槭ャ繧ｿ・・erver/routes/facilities.ts 縺ｨ蜷後§繝ｭ繧ｸ繝・け・・const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

type Day = (typeof days)[number];

function formatAvailability(row: any) {
  const availability: Record<Day, 'open' | 'limited' | 'closed'> = {
    mon: 'closed',
    tue: 'closed',
    wed: 'closed',
    thu: 'closed',
    fri: 'closed',
    sat: 'closed',
    sun: 'closed',
  };

  days.forEach((day) => {
    const dbKey = `${day}_availability`; // 萓・ mon_availability
    const dbValue = row[dbKey];

    let mapped: 'open' | 'limited' | 'closed';

    switch (dbValue) {
      case 'open':
      case 'circle':
        mapped = 'open';
        break;
      case 'limited':
      case 'triangle':
        mapped = 'limited';
        break;
      case 'closed':
      case 'cross':
      default:
        mapped =
          dbValue && ['open', 'limited', 'closed'].includes(dbValue)
            ? (dbValue as 'open' | 'limited' | 'closed')
            : 'closed';
        break;
    }

    availability[day] = mapped;
  });

  return availability;
}

function formatFacility(row: any) {
  return {
    id: row.id,
    userId: row.user_id ?? null,
    name: row.name,
    description: row.description,
    location: row.location,
    serviceType: row.service_type,
    phone: row.phone,
    website: row.website,
    rating: row.rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    email: row.email,
    imageUrl: row.image_url,
    services: row.services,
    capacity: row.capacity,
    staffCount: row.staff_count,
    operatingHours: row.operating_hours,
    reviews: row.reviews,
    availability: formatAvailability(row),
  };
}

// ---- 繝上Φ繝峨Λ ----
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = [
    'https://keamachi.vercel.app',
    'http://localhost:5173'
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For local dev via curl or unknown origins, allow specific local dev origin or none
    if (origin === 'http://localhost:5173') { // Fallback for specific local dev if not in allowedOrigins array
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) { // Allow requests without Origin header (e.g. curl)
      res.setHeader('Access-Control-Allow-Origin', '*'); // Or just omit header if not needed
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Added Authorization header

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // availability 逕ｨ縺ｮ繧ｫ繝ｩ繝繧ょ性繧√※蜈ｨ驛ｨ蜿悶ｋ (* 縺ｧOK)
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Supabase error (facilities list):', error);
        return res.status(500).json({
          error: 'Failed to fetch facilities from Supabase',
          detail: String(error.message),
        });
      }

      const facilities = (data ?? []).map(formatFacility);

      return res.status(200).json(facilities);
    } catch (e) {
      console.error('Unexpected error in /api/facilities:', e);
      return res.status(500).json({
        error: 'Failed to fetch facilities',
        detail: String(e),
      });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
