'use server';

import connectDB from '@/lib/db';
import { User, UserRegistry } from '@/models';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';
import { createUserSchema, updateUserSchema } from '@/shared/lib/utils/validations';
import { validateSchema } from '@/shared/lib/utils/validations/utils';

// Get all users (admin only)
export async function getAllUsers() {
    try {
        await connectDB();
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Get user by ID
export async function getUserById(id: string) {
    try {
        await connectDB();
        const user = await User.findById(id)
            .select('-password')
            .lean();

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

// Create new user (admin)
export async function createUser(data: unknown) {
    try {
        await connectDB();

        // Validate input
        const validation = validateSchema(createUserSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const userData = validation.data!;

        // Check if user exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return {
                success: false,
                error: 'Email already registered'
            };
        }

        // Hash password
        // userData.password is optional in schema but logic here requires hashing if present?
        // Schema seems to allow optional password in createUserSchema?
        // Let's check schema again. createUserSchema defines password as optional.
        // If password is explicitly required for new user creation in UMP, we might need a stricter schema or check here.
        // Assuming password IS provided for now or handled.
        // If password is not provided, bcrypt.hash might fail or we skip hashing.
        // Standard create usuallly entails a password.
        // If password is undefined, we probably shouldn't try to hash undefined.
        // However, User model requires password usually?

        let hashedPassword = undefined;
        if (userData.password) {
            hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        const user = await User.create({
            ...userData,
            password: hashedPassword,
            status: userData.status || 'active',
            joinedAt: new Date()
        });

        // Create user registry entry
        await UserRegistry.create({
            userId: user._id,
            registeredBy: userData.createdBy || 'system',
            source: 'admin'
        });

        revalidatePath('/ump');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to create user'
        };
    }
}

// Update user (admin)
export async function updateUser(id: string, data: unknown) {
    try {
        await connectDB();

        // Validate input
        const validation = validateSchema(updateUserSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const updateData = validation.data!;

        // If password is provided, hash it
        // The schema allows optional password.
        if (updateData.password) {
            // We need to re-assign or handle the hashed password. 
            // Since updateData is inferred from Zod, we can't easily mutate it if it's strictly typed as Readonly sometimes, 
            // but here it's likely a plain object.
            // But 'password' in updateData is string. We replace it.
            (updateData as Record<string, unknown>).password = await bcrypt.hash(updateData.password, 10);
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        revalidatePath('/ump');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update user'
        };
    }
}

// Delete user (admin)
export async function deleteUser(id: string) {
    try {
        await connectDB();

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // Delete associated registry
        await UserRegistry.findOneAndDelete({ userId: id });

        revalidatePath('/ump');
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to delete user'
        };
    }
}

// Get user statistics
export async function getUserStats() {
    try {
        await connectDB();

        const [total, active, inactive, admins, centers] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ status: 'inactive' }),
            User.countDocuments({ role: { $in: ['admin', 'god'] } }),
            User.countDocuments({ role: 'center' })
        ]);

        return { total, active, inactive, admins, centers };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { total: 0, active: 0, inactive: 0, admins: 0, centers: 0 };
    }
}
