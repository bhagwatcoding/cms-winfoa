import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Session } from '@/models';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (user.status !== 'active') {
            return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
        }

        // Create session
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await Session.create({
            token,
            userId: user._id,
            expiresAt,
            userAgent: request.headers.get('user-agent') || 'unknown',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        });

        // Set cookie
        (await cookies()).set('auth_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/',
        });

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
