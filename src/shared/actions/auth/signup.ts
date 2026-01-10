'use server';

import connectDB from '@/lib/db';
import { User, Session } from '@/models';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getDashboardUrlForRole } from '@/lib/helpers';
import { getErrorMessage } from '@/lib/utils';

interface SignupData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
}

export async function signupUser(data: SignupData) {
    try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            return {
                success: false,
                error: 'Email already registered'
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone || '',
            role: data.role || 'user',
            status: 'active',
            joinedAt: new Date()
        });

        // Create session
        const sessionToken = generateSessionToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await Session.create({
            userId: user._id,
            token: sessionToken,
            expiresAt
        });

        // Set cookie (match proxy's expected cookie name: auth_session)
        (await cookies()).set('auth_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/',
            domain: process.env.NODE_ENV === 'production'
                ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
                : undefined
        });

        // Get role-based dashboard URL
        const redirectUrl = getDashboardUrlForRole(user.role);

        return {
            success: true,
            redirectUrl,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Signup failed'
        };
    }
}

function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}
