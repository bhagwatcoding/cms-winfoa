/**
 * UMP User Management Actions
 * Comprehensive user management with permissions, status, and session control
 * Access control for all subdomain users
 */

'use server';

import connectDB from '@/lib/db';
import { User, Session } from '@/models';
import { getCurrentUser } from '@/lib/session';
import { requirePermission, userHasPermission } from '@/lib/permissions';
import type { IUser, UserRole } from '@/types/models';
import type { UpdateResponse, DeleteResponse } from '@/types/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';

// ==========================================
// ACTIVATE USER
// ==========================================

export async function activateUserAction(userId: string): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:update');

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
        }

        // Prevent self-modification
        if (user._id.toString() === currentUser?._id.toString()) {
            return { success: false, error: 'Cannot modify your own status' };
        }

        // Activate user
        user.isActive = true;
        user.status = 'active';
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: SUCCESS_MESSAGES.USER_ACTIVATED || 'User activated successfully',
            data: userObject as IUser,
        };
    } catch (error) {
        console.error('Activate user error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// DEACTIVATE USER
// ==========================================

export async function deactivateUserAction(userId: string): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:update');

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
        }

        // Prevent self-modification
        if (user._id.toString() === currentUser?._id.toString()) {
            return { success: false, error: 'Cannot deactivate your own account' };
        }

        // Deactivate user
        user.isActive = false;
        user.status = 'inactive';
        await user.save();

        // Invalidate all user sessions
        await Session.deleteMany({ userId: user._id });

        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: SUCCESS_MESSAGES.USER_DEACTIVATED || 'User deactivated successfully',
            data: userObject as IUser,
        };
    } catch (error) {
        console.error('Deactivate user error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// UPDATE USER PERMISSIONS
// ==========================================

export async function updateUserPermissionsAction(
    userId: string,
    permissions: string[]
): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Only super-admin and admin can modify permissions
        if (!userHasPermission(currentUser, 'users:manage')) {
            return { success: false, error: 'Insufficient permissions to modify user permissions' };
        }

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
        }

        // Update custom permissions
        user.customPermissions = permissions;
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: 'User permissions updated successfully',
            data: userObject as IUser,
        };
    } catch (error) {
        console.error('Update permissions error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// GET USER SESSIONS
// ==========================================

export async function getUserSessionsAction(userId: string) {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:view');

        await connectDB();

        const sessions = await Session.find({
            userId,
            expiresAt: { $gt: new Date() },
        })
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            data: sessions.map((session) => ({
                id: session._id.toString(),
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
                userAgent: session.userAgent,
                ipAddress: session.ipAddress,
            })),
        };
    } catch (error) {
        console.error('Get sessions error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// INVALIDATE USER SESSION
// ==========================================

export async function invalidateUserSessionAction(
    userId: string,
    sessionId: string
): Promise<DeleteResponse> {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:update');

        await connectDB();

        const result = await Session.findOneAndDelete({
            _id: sessionId,
            userId,
        });

        if (!result) {
            return { success: false, error: 'Session not found' };
        }

        return {
            success: true,
            message: 'Session invalidated successfully',
            deletedCount: 1,
        };
    } catch (error) {
        console.error('Invalidate session error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// INVALIDATE ALL USER SESSIONS
// ==========================================

export async function invalidateAllUserSessionsAction(userId: string): Promise<DeleteResponse> {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:update');

        await connectDB();

        const result = await Session.deleteMany({ userId });

        return {
            success: true,
            message: `${result.deletedCount} session(s) invalidated`,
            deletedCount: result.deletedCount,
        };
    } catch (error) {
        console.error('Invalidate all sessions error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// CHANGE USER ROLE
// ==========================================

export async function changeUserRoleAction(
    userId: string,
    newRole: UserRole
): Promise<UpdateResponse<IUser>> {
    try {
        const currentUser = await getCurrentUser();

        // Only super-admin can change roles
        requirePermission(currentUser, 'system:manage');

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
        }

        // Prevent self-modification
        if (user._id.toString() === currentUser?._id.toString()) {
            return { success: false, error: 'Cannot change your own role' };
        }

        // Update role
        user.role = newRole;
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;

        return {
            success: true,
            message: `User role changed to ${newRole} successfully`,
            data: userObject as IUser,
        };
    } catch (error) {
        console.error('Change role error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// GET USER ACTIVITY SUMMARY
// ==========================================

export async function getUserActivitySummaryAction(userId: string) {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:view');

        await connectDB();

        const user = await User.findById(userId).select('-password').lean();
        if (!user) {
            return { success: false, error: ERROR_MESSAGES.USER_NOT_FOUND };
        }

        // Get active sessions count
        const activeSessions = await Session.countDocuments({
            userId,
            expiresAt: { $gt: new Date() },
        });

        return {
            success: true,
            data: {
                user: user as IUser,
                activeSessions,
                lastLogin: user.lastLogin,
                accountCreated: user.createdAt,
                status: user.status,
                isActive: user.isActive,
            },
        };
    } catch (error) {
        console.error('Get activity summary error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// BULK ACTIVATE USERS
// ==========================================

export async function bulkActivateUsersAction(userIds: string[]): Promise<UpdateResponse<number>> {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:update');

        await connectDB();

        // Filter out current user from bulk operation
        const filteredIds = userIds.filter((id) => id !== currentUser?._id.toString());

        const result = await User.updateMany(
            { _id: { $in: filteredIds } },
            { $set: { isActive: true, status: 'active' } }
        );

        return {
            success: true,
            message: `${result.modifiedCount} user(s) activated successfully`,
            data: result.modifiedCount,
        };
    } catch (error) {
        console.error('Bulk activate error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// BULK DEACTIVATE USERS
// ==========================================

export async function bulkDeactivateUsersAction(userIds: string[]): Promise<UpdateResponse<number>> {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:update');

        await connectDB();

        // Filter out current user from bulk operation
        const filteredIds = userIds.filter((id) => id !== currentUser?._id.toString());

        // Deactivate users
        const result = await User.updateMany(
            { _id: { $in: filteredIds } },
            { $set: { isActive: false, status: 'inactive' } }
        );

        // Invalidate all sessions for deactivated users
        await Session.deleteMany({ userId: { $in: filteredIds } });

        return {
            success: true,
            message: `${result.modifiedCount} user(s) deactivated and sessions invalidated`,
            data: result.modifiedCount,
        };
    } catch (error) {
        console.error('Bulk deactivate error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}

// ==========================================
// GET ALL SUBDOMAINS USER STATS
// ==========================================

export async function getAllSubdomainStatsAction() {
    try {
        const currentUser = await getCurrentUser();
        requirePermission(currentUser, 'users:view');

        await connectDB();

        // Get user counts by role
        const roleStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    activeCount: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] },
                    },
                    inactiveCount: {
                        $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] },
                    },
                },
            },
        ]);

        // Get total stats
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const activeSessions = await Session.countDocuments({ expiresAt: { $gt: new Date() } });

        // Map roles to subdomains
        const subdomainMapping: Record<string, string> = {
            'super-admin': 'ump',
            admin: 'ump',
            staff: 'skills',
            center: 'skills',
            student: 'myaccount',
            user: 'myaccount',
        };

        interface SubdomainStats {
            total: number;
            active: number;
            inactive: number;
        }

        const subdomainStats = roleStats.reduce((acc: Record<string, SubdomainStats>, stat: { _id: string; count: number; activeCount: number; inactiveCount: number }) => {
            const subdomain = subdomainMapping[stat._id] || 'other';
            if (!acc[subdomain]) {
                acc[subdomain] = { total: 0, active: 0, inactive: 0 };
            }
            acc[subdomain].total += stat.count;
            acc[subdomain].active += stat.activeCount;
            acc[subdomain].inactive += stat.inactiveCount;
            return acc;
        }, {} as Record<string, SubdomainStats>);

        return {
            success: true,
            data: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
                activeSessions,
                roleStats: roleStats.reduce((acc: Record<string, SubdomainStats>, stat: { _id: string; count: number; activeCount: number; inactiveCount: number }) => {
                    acc[stat._id] = {
                        total: stat.count,
                        active: stat.activeCount,
                        inactive: stat.inactiveCount,
                    };
                    return acc;
                }, {} as Record<string, SubdomainStats>),
                subdomainStats,
            },
        };
    } catch (error) {
        console.error('Get subdomain stats error:', error);
        return { success: false, error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG };
    }
}
