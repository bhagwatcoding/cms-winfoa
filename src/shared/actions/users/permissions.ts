/**
 * Permission Management Actions
 * Manage custom user permissions (database-driven)
 */

'use server';

import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { getCurrentUser } from '@/core/session';
import { requirePermission } from '@/lib/permissions';
import type { Permission } from '@/lib/permissions';
import { ERROR_MESSAGES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import type { UpdateResponse } from '@/types/api';
import type { IUser } from '@/types/models';

// ==========================================
// ADD CUSTOM PERMISSION
// ==========================================

/**
 * Add custom permission to user
 * Only super-admin can manage permissions
 */
export async function addUserPermissionAction(
  userId: string,
  permission: Permission
): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Only super-admin can manage permissions
    requirePermission(currentUser, 'system:manage');

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Initialize customPermissions if not exists
    if (!user.customPermissions) {
      user.customPermissions = [];
    }

    // Check if permission already exists
    if (user.customPermissions.includes(permission)) {
      return {
        success: false,
        error: 'Permission already exists',
      };
    }

    // Add permission
    user.customPermissions.push(permission);
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      message: 'Permission added successfully',
      data: userObject as IUser,
    };
  } catch (error) {
    console.error('Add permission error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// REMOVE CUSTOM PERMISSION
// ==========================================

/**
 * Remove custom permission from user
 */
export async function removeUserPermissionAction(
  userId: string,
  permission: Permission
): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Only super-admin can manage permissions
    requirePermission(currentUser, 'system:manage');

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Remove permission
    if (user.customPermissions) {
      user.customPermissions = user.customPermissions.filter((p: string) => p !== permission);
    }

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      message: 'Permission removed successfully',
      data: userObject as IUser,
    };
  } catch (error) {
    console.error('Remove permission error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// SET USER PERMISSIONS
// ==========================================

/**
 * Set all custom permissions for user (replace existing)
 */
export async function setUserPermissionsAction(
  userId: string,
  permissions: Permission[]
): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Only super-admin can manage permissions
    requirePermission(currentUser, 'system:manage');

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Set permissions
    user.customPermissions = permissions;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      message: 'Permissions updated successfully',
      data: userObject as IUser,
    };
  } catch (error) {
    console.error('Set permissions error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// GET USER PERMISSIONS
// ==========================================

/**
 * Get all permissions for a user (role + custom)
 */
export async function getUserPermissionsAction(
  userId: string
): Promise<{ success: boolean; data?: Permission[]; error?: string }> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:view');

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Import getUserPermissions (to get merged permissions)
    const { getUserPermissions } = await import('@/lib/permissions/checker');
    const permissions = getUserPermissions(user);

    return {
      success: true,
      data: permissions,
    };
  } catch (error) {
    console.error('Get permissions error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// RESET USER PERMISSIONS
// ==========================================

/**
 * Reset user to role-based permissions only (clear custom)
 */
export async function resetUserPermissionsAction(userId: string): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Only super-admin can manage permissions
    requirePermission(currentUser, 'system:manage');

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Clear custom permissions
    user.customPermissions = [];
    user.permissionOverrides = [];
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    return {
      success: true,
      message: 'Permissions reset to role defaults',
      data: userObject as IUser,
    };
  } catch (error) {
    console.error('Reset permissions error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// COPY PERMISSIONS
// ==========================================

/**
 * Copy permissions from one user to another
 */
export async function copyUserPermissionsAction(
  fromUserId: string,
  toUserId: string
): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Only super-admin can manage permissions
    requirePermission(currentUser, 'system:manage');

    await connectDB();

    const [fromUser, toUser] = await Promise.all([
      User.findById(fromUserId),
      User.findById(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    // Copy permissions
    toUser.customPermissions = [...(fromUser.customPermissions || [])];
    toUser.permissionOverrides = [...(fromUser.permissionOverrides || [])];
    await toUser.save();

    const userObject = toUser.toObject();
    delete userObject.password;

    return {
      success: true,
      message: 'Permissions copied successfully',
      data: userObject as IUser,
    };
  } catch (error) {
    console.error('Copy permissions error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}
