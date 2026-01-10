import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Session } from '@/models';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_session')?.value;

        if (token) {
            await connectDB();
            await Session.deleteOne({ token });
        }

        cookieStore.delete('auth_session');

        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error: unknown) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
