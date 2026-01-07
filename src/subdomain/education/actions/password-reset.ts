'use server';

import { z } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/edu/models/User';
import PasswordResetToken from '@/edu/models/PasswordResetToken';
import { hashPassword } from '@/lib/auth';
import { redirect } from 'next/navigation';

// --- Schemas ---
const RequestResetSchema = z.object({
    email: z.string().email('Invalid email address'),
});

const ResetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ResetState = {
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string;
    success?: boolean;
};

// --- Actions ---

export async function requestPasswordReset(prevState: ResetState, formData: FormData): Promise<ResetState> {
    const validatedFields = RequestResetSchema.safeParse({
        email: formData.get('email'),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email } = validatedFields.data;

    try {
        await connectDB();
        const user = await User.findOne({ email });

        // For security, do not reveal if user does not exist
        if (!user) {
            return { success: true, message: 'If an account exists, a reset link has been sent.' };
        }

        // Generate Token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        // Save Token
        await PasswordResetToken.create({
            email,
            token,
            expiresAt
        });

        // SIMULATE EMAIL SENDING
        console.log('------------------------------------------------');
        console.log(`PASSWORD RESET LINK FOR ${email}:`);
        console.log(`http://localhost:3000/reset-password/${token}`);
        console.log('------------------------------------------------');

        return { success: true, message: 'Check your email for the reset link.' };
    } catch (error) {
        console.error('Reset request error:', error);
        return { message: 'Something went wrong. Please try again.' };
    }
}

export async function resetPassword(prevState: ResetState, formData: FormData): Promise<ResetState> {
    const validatedFields = ResetPasswordSchema.safeParse({
        token: formData.get('token'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const { token, password } = validatedFields.data;

    try {
        await connectDB();

        // Verify Token
        const resetToken = await PasswordResetToken.findOne({
            token,
            expiresAt: { $gt: new Date() }
        });

        if (!resetToken) {
            return { message: 'Invalid or expired reset token.' };
        }

        // Update User Password
        const hashedPassword = await hashPassword(password);
        await User.findOneAndUpdate(
            { email: resetToken.email },
            { password: hashedPassword }
        );

        // Delete Token
        await PasswordResetToken.deleteOne({ _id: resetToken._id });

    } catch (error) {
        console.error('Password reset error:', error);
        return { message: 'Failed to reset password.' };
    }

    redirect('/login?message=Password+reset+successful');
}
