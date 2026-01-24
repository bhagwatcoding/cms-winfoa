/**
 * UMP (User Management Portal) Actions Index
 * Consolidated actions for user management portal
 * All actions delegate to UMPService for business logic
 */

'use server';

import { UMPService } from '@/shared/services';
import type { IUser } from '@/types/models';
import type { UpdateResponse, DeleteResponse } from '@/types/api';

// ==========================================
// USER STATUS MANAGEMENT
// ==========================================

/**
 * Activate a user account
 */
export async function activateUserAction(userId: string): Promise<UpdateResponse<IUser>> {
    return UMPService.activateUser(userId);
}

/**
 * Deactivate a user account
 */
export async function deactivateUserAction(userId: string): Promise<UpdateResponse<IUser>> {
    return UMPService.deactivateUser(userId);
}

/**
 * Get user management data
 */
export async function getUserManagementData() {
    return UMPService.getUserManagementData();
}

// ==========================================
// USER ROLE MANAGEMENT
// ==========================================

/**
 * Assign role to user
 */
export async function assignRoleToUserAction(userId: string, roleId: string): Promise<UpdateResponse<IUser>> {
    return UMPService.assignRoleToUser(userId, roleId);
}

/**
 * Remove role from user
 */
export async function removeRoleFromUserAction(userId: string): Promise<UpdateResponse<IUser>> {
    return UMPService.removeRoleFromUser(userId);
}

// ==========================================
// USER PERMISSION MANAGEMENT
// ==========================================

/**
 * Update user permissions
 */
export async function updateUserPermissionsAction(
    userId: string, 
    permissions: string[]
): Promise<UpdateResponse<IUser>> {
    return UMPService.updateUserPermissions(userId, permissions);
}

/**
 * Reset user permissions to role defaults
 */
export async function resetUserPermissionsAction(userId: string): Promise<UpdateResponse<IUser>> {
    return UMPService.resetUserPermissions(userId);
}

// ==========================================
// BULK OPERATIONS
// ==========================================

/**
 * Bulk activate users
 */
export async function bulkActivateUsersAction(userIds: string[]): Promise<UpdateResponse<IUser[]>> {
    return UMPService.bulkActivateUsers(userIds);
}

/**
 * Bulk deactivate users
 */
export async function bulkDeactivateUsersAction(userIds: string[]): Promise<UpdateResponse<IUser[]>> {
    return UMPService.bulkDeactivateUsers(userIds);
}

/**
 * Bulk delete users (soft delete)
 */
export async function bulkDeleteUsersAction(userIds: string[]): Promise<DeleteResponse> {
    return UMPService.bulkDeleteUsers(userIds);
}