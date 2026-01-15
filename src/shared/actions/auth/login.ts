'use server';

import connectDB from '@/shared/lib/db';
import { User } from '@/models';
import { getDashboardUrlForRole } from '@/shared/lib/helpers';
import { loginSchema, type LoginInput } from '@/shared/lib/utils/validations';
import { validateSchema } from '@/shared/lib/utils/validations/utils';
import { createSession, setSessionCookie, logout as logoutSession } from '@/shared/lib/session';
import type { LoginResponse, LogoutResponse } from '@/types/api';
import { getErrorMessage } from '@/shared/lib/utils';

export async function loginUser(credentials: LoginInput): Promise<LoginResponse> {
    // Validate input
    const validation = validateSchema(loginSchema, credentials);

    if (!validation.success) {
        return {
            success: false,
            error: validation.errors?.[0]?.message || 'Invalid credentials',
            errors: validation.errors
        };
    }

    // TypeScript: validation.data is guaranteed to exist when success is true
    const { email, password } = validation.data!;

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
        const isPasswordValid = await user.comparePassword(password);

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

        // Create session using new session utilities
        const session = await createSession(
            user._id.toString(),
            '', // userAgent - can be passed from client
            ''  // ipAddress - can be extracted from request
        );

        // Set session cookie
        await setSessionCookie(session.token, session.expiresAt);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Get role-based dashboard URL
        const redirectUrl = getDashboardUrlForRole(user.role);

        return {
            success: true,
            redirectUrl,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Login failed'
        };
    }
}

export async function logoutUser(): Promise<LogoutResponse> {
    try {
        await logoutSession();
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Logout failed'
        };
    }
}
