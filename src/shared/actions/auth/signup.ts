'use server';

import connectDB from '@/lib/db';
import { User, Session } from '@/models';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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

        // Set cookie
        (await cookies()).set('session_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/'
        });

        // Determine redirect
        let redirectUrl = '/myaccount';
        if (user.role === 'admin' || user.role === 'god') {
            redirectUrl = '/ump';
        } else if (user.role === 'center') {
            redirectUrl = '/skills';
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
        console.error('Signup error:', error);
        return {
            success: false,
            error: error.message || 'Signup failed'
        };
    }
}

function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}
