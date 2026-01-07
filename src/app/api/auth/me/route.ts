import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { user, session } = await getSession();

        if (!user || !session) {
            return NextResponse.json({
                authenticated: false,
                user: null
            });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                phone: user.phone,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json({
            authenticated: false,
            user: null,
            error: 'Failed to get user session'
        }, { status: 500 });
    }
}
