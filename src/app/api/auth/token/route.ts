/**
 * Token Validation API Route
 * Validates session tokens and provides user information
 * Supports: GET (validate), POST (refresh), DELETE (invalidate)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { Session } from '@/models';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_DURATION_DAYS = 7;

/**
 * GET - Validate current session token
 */
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No session token found',
                    authenticated: false,
                },
                { status: 401 }
            );
        }

        await connectDB();

        // Find session with user populated
        const session = await Session.findOne({
            token,
            expiresAt: { $gt: new Date() },
        }).populate('userId');

        if (!session) {
            // Clear invalid cookie
            cookieStore.delete(SESSION_COOKIE_NAME);

            return NextResponse.json(
                {
                    success: false,
                    error: 'Session expired or invalid',
                    authenticated: false,
                },
                { status: 401 }
            );
        }

        const user = session.userId as unknown as import('@/types/models').IUser;

        // Check if user is active
        if (!user || user.status !== 'active') {
            // Invalidate session for deactivated user
            await Session.findByIdAndDelete(session._id);
            cookieStore.delete(SESSION_COOKIE_NAME);

            return NextResponse.json(
                {
                    success: false,
                    error: 'Account is deactivated',
                    authenticated: false,
                },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            authenticated: true,
            user: {
                id: user._id.toString(),
                name: user.fullName || `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role,
                status: user.status,
                isActive: user.status === 'active',
                permissions: user.customPermissions || [],
            },
            session: {
                expiresAt: session.expiresAt,
                createdAt: session.createdAt,
            },
        });
    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Token validation failed',
            },
            { status: 500 }
        );
    }
}

/**
 * POST - Refresh session token (extend expiration)
 */
export async function POST() {
    try {
        const cookieStore = await cookies();
        const currentToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!currentToken) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No session token to refresh',
                },
                { status: 401 }
            );
        }

        await connectDB();

        // Find existing session
        const existingSession = await Session.findOne({
            token: currentToken,
            expiresAt: { $gt: new Date() },
        });

        if (!existingSession) {
            cookieStore.delete(SESSION_COOKIE_NAME);

            return NextResponse.json(
                {
                    success: false,
                    error: 'Session not found or expired',
                },
                { status: 401 }
            );
        }

        // Generate new token
        const newToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

        // Update session with new token
        existingSession.token = newToken;
        existingSession.expiresAt = expiresAt;
        await existingSession.save();

        // Set new cookie with domain for cross-subdomain access
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
        const domain = process.env.NODE_ENV === 'production'
            ? `.${rootDomain.replace(/:\d+$/, '')}`
            : undefined;

        cookieStore.set(SESSION_COOKIE_NAME, newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            expires: expiresAt,
            domain,
        });

        return NextResponse.json({
            success: true,
            message: 'Session refreshed successfully',
            expiresAt,
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Token refresh failed',
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Invalidate current session (logout)
 */
export async function DELETE() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (token) {
            await connectDB();
            await Session.findOneAndDelete({ token });
        }

        cookieStore.delete(SESSION_COOKIE_NAME);

        return NextResponse.json({
            success: true,
            message: 'Session invalidated successfully',
        });
    } catch (error) {
        console.error('Token invalidation error:', error);

        // Still clear cookie even on error
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE_NAME);

        return NextResponse.json({
            success: true,
            message: 'Session cleared',
        });
    }
}
