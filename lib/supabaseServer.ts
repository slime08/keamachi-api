// keamachi-api/lib/supabaseServer.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Standardized on SUPABASE_URL
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  // 起動時に気づけるように強めに出す（ログだけで落としたくないなら throw を外してOK）
  console.error('ERROR: Supabase URL or Service Role Key is missing. Check keamachi-api/.env(.local) or Vercel env.')
} else {
  console.log('Supabase URL (partial):', supabaseUrl.substring(0, 20) + '...')
  console.log('Supabase Service Role Key (present):', !!supabaseKey)
}

// createClient は string を要求するので、未設定時は空文字にしておく（実行時は当然失敗する）
const supabase: SupabaseClient = createClient(supabaseUrl ?? '', supabaseKey ?? '', {
  auth: { persistSession: false },
})

export default supabase
