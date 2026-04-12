import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Add them in your host’s environment (e.g. Vercel → Project → Settings → Environment Variables), ' +
      'then trigger a new deploy. Vite reads these only at build time.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
