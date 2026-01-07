import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Session from '@/edu/models/Session';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_session')?.value;

        if (token) {
            await connectDB();
            await Session.deleteOne({ token });
        }

        cookieStore.delete('auth_session');

        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
