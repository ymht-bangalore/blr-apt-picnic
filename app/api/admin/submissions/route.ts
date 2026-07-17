import {NextResponse} from 'next/server';
import {supabaseAdmin, isAdminSupabaseConfigured} from '@/lib/supabaseAdmin';

// Common password check helper
function verifyPassword(request: Request): boolean {
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD;
    return !!adminPassword && password === adminPassword;
}

export async function GET(request: Request) {
    try {
        if (!verifyPassword(request)) {
            return NextResponse.json({error: 'Unauthorized: Invalid password'}, {status: 401});
        }

        if (isAdminSupabaseConfigured && supabaseAdmin) {
            const {data, error} = await supabaseAdmin
                .from('registrations')
                .select('*')
                .order('created_at', {ascending: false});

            if (error) {
                console.error('Database fetch error:', error);
                return NextResponse.json({error: `Database error: ${error.message}`}, {status: 500});
            }

            return NextResponse.json({submissions: data || []});
        }

        return NextResponse.json({error: 'Supabase database is not configured.'}, {status: 500});
    } catch (e: any) {
        return NextResponse.json(
            {error: e.message || 'An unexpected error occurred on the server.'},
            {status: 500}
        );
    }
}

export async function PATCH(request: Request) {
    try {
        if (!verifyPassword(request)) {
            return NextResponse.json({error: 'Unauthorized: Invalid password'}, {status: 401});
        }

        const {id, status} = await request.json();

        if (!id || !status) {
            return NextResponse.json({error: 'Missing required parameters: id and status'}, {status: 400});
        }

        if (isAdminSupabaseConfigured && supabaseAdmin) {
            const {data, error} = await supabaseAdmin
                .from('registrations')
                .update({status})
                .eq('id', id)
                .select();

            if (error) {
                console.error('Database update error:', error);
                return NextResponse.json({error: `Database error: ${error.message}`}, {status: 500});
            }

            return NextResponse.json({success: true, data});
        }

        return NextResponse.json({error: 'Supabase database is not configured.'}, {status: 500});
    } catch (e: any) {
        return NextResponse.json(
            {error: e.message || 'An unexpected error occurred on the server.'},
            {status: 500}
        );
    }
}
