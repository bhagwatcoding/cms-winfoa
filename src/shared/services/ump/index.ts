/**
 * UMP (User Management Portal) Service
 * Handles all user management operations for admin users
 * Includes user activation, deactivation, role management, and bulk operations
 */

import { connectDB } from '@/lib/db';
import { User, Session, Role } from '@/models';
import { SessionService } from '@/shared/services/session';
import { requirePermission, userHasPermission } from '@/lib/permissions';
import type { IUser, UserRole } from '@/types/models';
import type { UpdateResponse, DeleteResponse } from '@/types/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import mongoose from "mongoose";
import { getErrorMessage } from '@/core/utils';

export class UMPService {
    /**
     * Activate a user account
     */
    static async activateUser(userId: string): Promise<UpdateResponse<IUser>> {
        try {
            await connectDB();
            
            // Get current user from session
            const currentUser = await SessionService.getCurrentSession();
            if (!currentUser?.userId) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.UNAUTHORIZED 
                };
            }

            // Check permissions
            requirePermission(currentUser.userId, 'users:update');

            // Get requesting user to check their role
            const requestingUser = await User.findById(currentUser.userId).populate('roleId');
            if (!requestingUser) throw new Error('Requesting user not found');

            // Find and update user
            const user = await User.findById(userId).populate('roleId');
            if (!user) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.USER_NOT_FOUND 
                };
            }

            // Prevent modification of god users by non-god users
            if (user.role === 'god' && requestingUser.role !== 'god') {
                return { 
                    success: false, 
                    error: 'Only god users can modify other god users' 
                };
            }

            // Update user status
            user.status = 'active';
            user.statusChangedAt = new Date();
            user.statusChangedBy = currentUser.userId._id;
            await user.save();

            return { 
                success: true, 
                data: user 
            };
        } catch (error) {
            console.error('Activate user error:', error);
            return { 
                success: false, 
                error: getErrorMessage(error) 
            };
        }
    }

    /**
     * Deactivate a user account
     */
    static async deactivateUser(userId: string): Promise<UpdateResponse<IUser>> {
        try {
            await connectDB();
            
            const currentUser = await SessionService.getCurrentSession();
            if (!currentUser?.userId) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.UNAUTHORIZED 
                };
            }

            requirePermission(currentUser.userId, 'users:update');

            // Get requesting user
            const requestingUser = await User.findById(currentUser.userId).populate('roleId');
            if (!requestingUser) throw new Error('Requesting user not found');

            const user = await User.findById(userId).populate('roleId');
            if (!user) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.USER_NOT_FOUND 
                };
            }

            // Prevent modification of god users by non-god users
            if (user.role === 'god' && requestingUser.role !== 'god') {
                return { 
                    success: false, 
                    error: 'Only god users can modify other god users' 
                };
            }

            user.status = 'inactive';
            user.statusChangedAt = new Date();
            user.statusChangedBy = currentUser.userId._id;
            await user.save();

            return { 
                success: true, 
                data: user 
            };
        } catch (error) {
            console.error('Deactivate user error:', error);
            return { 
                success: false, 
                error: getErrorMessage(error) 
            };
        }
    }

    /**
     * Get user management data with pagination and filtering
     */
    static async getUserManagementData(
        page: number = 1,
        limit: number = 20,
        filters: any = {}
    ) {
        try {
            await connectDB();
            
            const currentUser = await SessionService.getCurrentSession();
            if (!currentUser?.userId) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            requirePermission(currentUser.userId, 'users:read' as any);

            // Build query
            const query: any = { isDeleted: { $ne: true } };
            
            // Apply filters
            if (filters.role) query.role = filters.role;
            if (filters.status) query.status = filters.status;
            if (filters.search) {
                query.$or = [
                    { firstName: { $regex: filters.search, $options: 'i' } },
                    { lastName: { $regex: filters.search, $options: 'i' } },
                    { email: { $regex: filters.search, $options: 'i' } }
                ];
            }

            // Execute query with pagination
            const skip = (page - 1) * limit;
            const [users, total] = await Promise.all([
                User.find(query)
                    .select('-password')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                User.countDocuments(query)
            ]);

            return {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get user management data error:', error);
            throw error;
        }
    }

    /**
     * Assign role to user
     */
    static async assignRoleToUser(
        userId: string, 
        roleId: string
    ): Promise<UpdateResponse<IUser>> {
        try {
            await connectDB();
            
            const currentUser = await SessionService.getCurrentSession();
            if (!currentUser?.userId) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.UNAUTHORIZED 
                };
            }

            requirePermission(currentUser.userId, 'users:update');

            // Get requesting user
            const requestingUser = await User.findById(currentUser.userId).populate('roleId');
            if (!requestingUser) throw new Error('Requesting user not found');

            const user = await User.findById(userId).populate('roleId');
            if (!user) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.USER_NOT_FOUND 
                };
            }

            // Prevent modification of god users by non-god users
            if (user.role === 'god' && requestingUser.role !== 'god') {
                return { 
                    success: false, 
                    error: 'Only god users can modify other god users' 
                };
            }

            user.roleId = new mongoose.Types.ObjectId(roleId) as any;
            await user.save();

            return { 
                success: true, 
                data: user 
            };
        } catch (error) {
            console.error('Assign role to user error:', error);
            return { 
                success: false, 
                error: getErrorMessage(error) 
            };
        }
    }

    /**
     * Remove role from user
     */
    static async removeRoleFromUser(userId: string): Promise<UpdateResponse<IUser>> {
        try {
            await connectDB();
            
            const currentUser = await SessionService.getCurrentSession();
            if (!currentUser?.userId) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.UNAUTHORIZED 
                };
            }

            requirePermission(currentUser.userId, 'users:update');

            // Get requesting user
            const requestingUser = await User.findById(currentUser.userId).populate('roleId');
            if (!requestingUser) throw new Error('Requesting user not found');

            const user = await User.findById(userId).populate('roleId');
            if (!user) {
                return { 
                    success: false, 
                    error: ERROR_MESSAGES.USER_NOT_FOUND 
                };
            }

            // Prevent modification of god users by non-god users
            if (user.role === 'god' && requestingUser.role !== 'god') {
                return { 
                    success: false, 
                    error: 'Only god users can modify other god users' 
                };
            }

            // Find default user role
            const userRole = await Role.findOne({ slug: 'user' });
            if (!userRole) throw new Error('Default user role not found');

            // Set to default user role
            user.roleId = userRole._id; // Will use default role
            await user.save();

            return { 
                success: true, 
                data: user 
            };
        } catch (error) {
            console.error('Remove role from user error:', error);
            return { 
                success: false, 
                error: getErrorMessage(error) 
            };
        }
    }
}