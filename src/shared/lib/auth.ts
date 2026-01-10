import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import { Session } from '@/models';
import type { IUser, ISession } from '@/models';

// Constants
const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_DURATION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
}

export async function createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
    await connectDB();

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

    await Session.create({
        userId,
        token,
        expiresAt,
        userAgent,
        ipAddress
    });

    return token;
}

export async function getSession(): Promise<{ user: IUser | null, session: ISession | null }> {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

        if (!token) {
            return { user: null, session: null };
        }

        const session = await Session.findOne({
            token,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!session) {
            return { user: null, session: null };
        }

        return { user: session.userId as IUser, session };
    } catch (error) {
        console.error('Session retrieval error:', error);
        return { user: null, session: null };
    }
}

export async function login(userId: string) {
    const token = await createSession(userId);
    const cookieStore = await cookies();

    // expiry date calculation
    const expires = new Date();
    expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires
    });
}

export async function logout() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
        await connectDB();
        await Session.findOneAndDelete({ token });
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth() {
    const { user } = await getSession();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}
