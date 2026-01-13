'use server';

import connectDB from '@/shared/lib/db';
import { User, UserPreferences } from '@/models';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/shared/lib/utils';
import { updateProfileSchema, updateUserPreferencesSchema } from '@/shared/lib/validations';
import { validateSchema } from '@/shared/lib/validations/utils';

// Get user profile
export async function getUserProfile(userId: string) {
    try {
        await connectDB();
        const user = await User.findById(userId)
            .select('-password')
            .lean();

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

// Update user profile
export async function updateUserProfile(userId: string, data: unknown) {
    try {
        await connectDB();

        // Validate input
        const validation = validateSchema(updateProfileSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: validation.data },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        revalidatePath('/myaccount');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error) {
        console.error('Error updating profile:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update profile'
        };
    }
}

// Get user preferences
export async function getUserPreferences(userId: string) {
    try {
        await connectDB();
        let preferences = await UserPreferences.findOne({ userId }).lean();

        // Create default if not exists
        if (!preferences) {
            preferences = await UserPreferences.create({
                userId,
                language: 'en',
                theme: 'light',
                notifications: {
                    email: true,
                    push: true,
                    sms: false
                }
            });
        }

        return JSON.parse(JSON.stringify(preferences));
    } catch (error) {
        console.error('Error fetching preferences:', error);
        return null;
    }
}

// Update user preferences
export async function updateUserPreferences(userId: string, data: unknown) {
    try {
        await connectDB();

        // Validate input
        const validation = validateSchema(updateUserPreferencesSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const preferences = await UserPreferences.findOneAndUpdate(
            { userId },
            { $set: validation.data },
            { new: true, upsert: true, runValidators: true }
        );

        revalidatePath('/myaccount/settings');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(preferences))
        };
    } catch (error) {
        console.error('Error updating preferences:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update preferences'
        };
    }
}
