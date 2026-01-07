'use server';

import connectDB from '@/lib/db';
import { User, Session } from '@/models';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function loginUser(email: string, password: string) {
    try {
        await connectDB();

        // Find user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                error: 'Invalid email or password'
            };
        }

        // Check if user is active
        if (user.status !== 'active') {
            return {
                success: false,
                error: 'Your account is not active. Please contact support.'
            };
        }

        // Create session
        const sessionToken = generateSessionToken();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await Session.create({
            userId: user._id,
            token: sessionToken,
            expiresAt,
            userAgent: '', // Will be set from client
            ipAddress: '' // Will be set from server
        });

        // Set cookie
        (await cookies()).set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/'
        });

        // Determine redirect based on role
        let redirectUrl = '/myaccount';
        if (user.role === 'admin' || user.role === 'god') {
            redirectUrl = '/ump';
        } else if (user.role === 'center') {
            redirectUrl = '/skills';
        } else if (user.role === 'developer') {
            redirectUrl = '/developer';
        }

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
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message || 'Login failed'
        };
    }
}

export async function logoutUser() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;

        if (sessionToken) {
            await connectDB();
            await Session.findOneAndDelete({ token: sessionToken });
        }

        cookieStore.delete('session_token');

        return { success: true };
    } catch (error: any) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: error.message || 'Logout failed'
        };
    }
}

function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}
