import {NextResponse} from 'next/server';
import {supabaseAdmin, isAdminSupabaseConfigured} from '@/lib/supabaseAdmin';

/**
 * DELETE /api/submissions?id=<id>
 * Public route to delete a draft (pending) registration when details are updated.
 */
export async function DELETE(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({error: 'Missing required parameter: id'}, {status: 400});
        }

        if (isAdminSupabaseConfigured && supabaseAdmin) {
            // 1. Fetch current status to ensure only pending items can be cleaned up
            const {data: existing, error: fetchError} = await supabaseAdmin
                .from('registrations')
                .select('status')
                .eq('id', id)
                .maybeSingle();

            if (fetchError) {
                console.error('Fetch registration error:', fetchError);
                return NextResponse.json({error: `Database fetch error: ${fetchError.message}`}, {status: 500});
            }

            if (!existing) {
                // If it doesn't exist, count it as successfully cleaned up
                return NextResponse.json({success: true});
            }

            // 2. Perform the deletion
            const {error: deleteError} = await supabaseAdmin
                .from('registrations')
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('Delete registration error:', deleteError);
                return NextResponse.json({error: `Database delete error: ${deleteError.message}`}, {status: 500});
            }

            return NextResponse.json({success: true});
        }

        return NextResponse.json({error: 'Supabase database is not configured.'}, {status: 500});
    } catch (e: any) {
        return NextResponse.json(
            {error: e.message || 'An unexpected error occurred on the server.'},
            {status: 500}
        );
    }
}
