// keamachi-api/api/facilities.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ---- Supabase HTTP クライアント ----
const supabaseUrl = process.env.SUPABASE_HTTP_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_HTTP_URL or SUPABASE_ANON_KEY is not set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 一覧用のフォーマッタ（server/routes/facilities.ts と同じロジック）
const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

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
    const dbKey = `${day}_availability`; // 例: mon_availability
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

// ---- ハンドラ ----
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  if (req.method === 'GET') {
    try {
      // availability 用のカラムも含めて全部取る (* でOK)
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
