'use server';

import connectDB from '@/lib/db';
import { User, UserRegistry } from '@/models';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

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
export async function createUser(data: any) {
    try {
        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return {
                success: false,
                error: 'Email already registered'
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            ...data,
            password: hashedPassword,
            status: data.status || 'active',
            joinedAt: new Date()
        });

        // Create user registry entry
        await UserRegistry.create({
            userId: user._id,
            registeredBy: data.createdBy || 'system',
            source: 'admin'
        });

        revalidatePath('/ump');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(user))
        };
    } catch (error: any) {
        console.error('Error creating user:', error);
        return {
            success: false,
            error: error.message || 'Failed to create user'
        };
    }
}

// Update user (admin)
export async function updateUser(id: string, data: any) {
    try {
        await connectDB();

        // If password is provided, hash it
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: data },
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
    } catch (error: any) {
        console.error('Error updating user:', error);
        return {
            success: false,
            error: error.message || 'Failed to update user'
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
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete user'
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
