/**
 * User Management Actions
 * Server actions for user CRUD operations with role management
 */

'use server';

import connectDB from '@/lib/db';
import { User } from '@/models';
import { getCurrentUser } from '@/lib/session';
import { requirePermission } from '@/lib/permissions';
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from '@/lib/validations';
import { validateSchema } from '@/lib/validations/utils';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';
import type { CreateResponse, UpdateResponse, DeleteResponse, FetchManyResponse, PaginatedResponse } from '@/types/api';
import type { IUser, UserRole } from '@/types/models';
import bcrypt from 'bcryptjs';

// ==========================================
// CREATE USER
// ==========================================

export async function createUserAction(data: unknown): Promise<CreateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:create');

        // Validate input
        const validation = validateSchema(createUserSchema, data);

        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
                errors: validation.errors
            };
        }

        const userData = validation.data!;

        await connectDB();

        // Check if email already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return {
                success: false,
                error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
            };
        }

        // Hash password if provided
        let hashedPassword: string | undefined;
        if (userData.password) {
            hashedPassword = await bcrypt.hash(userData.password, 10);
        }

        // Create user
        const user = await User.create({
            ...userData,
            password: hashedPassword,
            status: userData.status || 'active',
            joinedAt: new Date(),
            emailVerified: userData.emailVerified || false,
            isActive: userData.isActive !== false,
        });

        // Remove password from response
        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: SUCCESS_MESSAGES.USER_CREATED,
            data: userObject as IUser,
        };
    } catch (error: any) {
        console.error('Create user error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// UPDATE USER
// ==========================================

export async function updateUserAction(
    userId: string,
    data: unknown
): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:update');

        // Validate input
        const validation = validateSchema(updateUserSchema, data);

        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
                errors: validation.errors
            };
        }

        const updateData = validation.data!;

        await connectDB();

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.USER_NOT_FOUND
            };
        }

        // Check if email is being changed and already exists
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await User.findOne({ email: updateData.email });
            if (existingUser) {
                return {
                    success: false,
                    error: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
                };
            }
        }

        // Update user
        Object.assign(user, updateData);
        await user.save();

        // Remove password from response
        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: SUCCESS_MESSAGES.USER_UPDATED,
            data: userObject as IUser,
        };
    } catch (error: any) {
        console.error('Update user error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// DELETE USER
// ==========================================

export async function deleteUserAction(userId: string): Promise<DeleteResponse> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:delete');

        await connectDB();

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.USER_NOT_FOUND
            };
        }

        // Prevent deleting own account
        if (user._id.toString() === currentUser?._id.toString()) {
            return {
                success: false,
                error: 'Cannot delete your own account'
            };
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        return {
            success: true,
            message: SUCCESS_MESSAGES.USER_DELETED,
            deletedCount: 1,
        };
    } catch (error: any) {
        console.error('Delete user error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// GET USER
// ==========================================

export async function getUserAction(userId: string): Promise<CreateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:view');

        await connectDB();

        const user = await User.findById(userId).select('-password').lean();

        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.USER_NOT_FOUND
            };
        }

        return {
            success: true,
            data: user as IUser,
        };
    } catch (error: any) {
        console.error('Get user error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// GET USERS (PAGINATED)
// ==========================================

export async function getUsersAction(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: string;
}): Promise<PaginatedResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:view');

        await connectDB();

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = {};

        if (params?.search) {
            query.$or = [
                { name: { $regex: params.search, $options: 'i' } },
                { email: { $regex: params.search, $options: 'i' } },
            ];
        }

        if (params?.role) {
            query.role = params.role;
        }

        if (params?.status) {
            query.status = params.status;
        }

        // Get users
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            User.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            data: users as IUser[],
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    } catch (error: any) {
        console.error('Get users error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
            data: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        };
    }
}

// ==========================================
// UPDATE USER ROLE
// ==========================================

export async function updateUserRoleAction(
    userId: string,
    role: UserRole
): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission (only super-admin can change roles)
        requirePermission(currentUser, 'system:manage');

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.USER_NOT_FOUND
            };
        }

        // Prevent changing own role
        if (user._id.toString() === currentUser?._id.toString()) {
            return {
                success: false,
                error: 'Cannot change your own role'
            };
        }

        // Update role
        user.role = role;
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: 'User role updated successfully',
            data: userObject as IUser,
        };
    } catch (error: any) {
        console.error('Update role error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// TOGGLE USER STATUS
// ==========================================

export async function toggleUserStatusAction(userId: string): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:update');

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.USER_NOT_FOUND
            };
        }

        // Toggle status
        user.isActive = !user.isActive;
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: userObject as IUser,
        };
    } catch (error: any) {
        console.error('Toggle status error:', error);
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}
