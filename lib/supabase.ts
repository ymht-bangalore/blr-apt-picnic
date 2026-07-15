import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey.length > 0 &&
    !supabaseAnonKey.includes('your-anon-public-key');

// Create a single Supabase client instance if configured
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
