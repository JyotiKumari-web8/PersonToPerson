import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabasePublishableKey.includes('your-publishable-key')
);

// Fallback dummy client if not yet configured, to avoid instantiation crash
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder-publishable-key';

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : dummyUrl,
  isSupabaseConfigured ? supabasePublishableKey : dummyKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
