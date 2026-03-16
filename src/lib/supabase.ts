import { createClient } from '@supabase/supabase-js';

// Access environment variables with fallbacks to prevent runtime crashes
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// If variables are missing, we use a dummy URL to prevent the "supabaseUrl is required" error
// but we log a warning so the user knows they need to configure it.
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    '⚠️ Supabase configuration missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
  );
}

// Use a placeholder URL if missing to avoid crashing the app on load
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
