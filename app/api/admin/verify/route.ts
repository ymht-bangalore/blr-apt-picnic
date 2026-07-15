import {NextResponse} from 'next/server';

export async function POST(request: Request) {
    try {
        const {password} = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json(
                {error: 'Admin password is not configured on the server. Please check your .env.local file.'},
                {status: 500}
            );
        }

        if (password === adminPassword) {
            return NextResponse.json({success: true});
        }

        return NextResponse.json(
            {success: false, error: 'Invalid admin password. Please try again.'},
            {status: 401}
        );
    } catch (e: any) {
        return NextResponse.json(
            {error: e.message || 'An unexpected error occurred on the server.'},
            {status: 500}
        );
    }
}
