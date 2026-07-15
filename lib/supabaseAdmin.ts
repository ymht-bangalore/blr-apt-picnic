import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';

export const isAdminSupabaseConfigured =
    supabaseUrl.length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseSecretKey.length > 0 &&
    !supabaseSecretKey.includes('your-secret-key');

// Create a single admin Supabase client instance if configured (server-side only)
export const supabaseAdmin = isAdminSupabaseConfigured
    ? createClient(supabaseUrl, supabaseSecretKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })
    : null;
