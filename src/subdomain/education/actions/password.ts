"use server";

import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/edu/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Enhanced Zod Schema with password strength requirements
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(6, 'New password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type PasswordState = {
    errors?: {
        currentPassword?: string[];
        newPassword?: string[];
        confirmPassword?: string[];
        _form?: string[];
    };
    message?: string;
};

export async function changePassword(prevState: PasswordState, formData: FormData): Promise<PasswordState> {
    try {
        const { user } = await getSession();

        if (!user) {
            return {
                errors: {
                    _form: ['Authentication required. Please log in again.']
                }
            };
        }

        // Extract and validate form data with Zod
        const formDataObj = {
            currentPassword: formData.get('currentPassword') as string,
            newPassword: formData.get('newPassword') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        };

        const result = changePasswordSchema.safeParse(formDataObj);

        if (!result.success) {
            return { errors: result.error.flatten().fieldErrors };
        }

        const { currentPassword, newPassword } = result.data;

        // Verify current password
        await connectDB();
        const dbUser = await User.findById(user._id);

        if (!dbUser) {
            return {
                errors: {
                    _form: ['User not found. Please contact support.']
                }
            };
        }

        const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password);

        if (!isValidPassword) {
            return {
                errors: {
                    currentPassword: ['Current password is incorrect']
                }
            };
        }

        // Check if new password is same as current
        const isSamePassword = await bcrypt.compare(newPassword, dbUser.password);
        if (isSamePassword) {
            return {
                errors: {
                    newPassword: ['New password must be different from current password']
                }
            };
        }

        // Hash new password and update (using bcrypt rounds of 12 for better security)
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        dbUser.password = hashedPassword;
        await dbUser.save();

        revalidatePath('/center/change-password');
        return { message: 'success' };
    } catch (error: any) {
        console.error('Failed to change password:', error);
        return {
            errors: {
                _form: [error.message || 'Failed to change password. Please try again.']
            }
        };
    }
}
