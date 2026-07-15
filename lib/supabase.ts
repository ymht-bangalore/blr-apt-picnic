import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    supabasePublishableKey.length > 0 &&
    !supabasePublishableKey.includes('your-publishable-key')

// Create a single Supabase client instance if configured
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;
