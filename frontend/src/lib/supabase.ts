// Supabase Auth is initialized for FUTURE use (client login portal) — no page
// uses it yet, and the anon key has ZERO table access (RLS: service-role only).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
    : null;

if (!supabase) {
  // eslint-disable-next-line no-console
  console.warn('Supabase client not initialized — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing.');
}
