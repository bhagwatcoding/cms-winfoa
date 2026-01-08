/**
 * Permission Checking Utilities
 * High-performance permission validation with caching
 */

import { cache } from 'react';
import type { Permission } from './constants';
import type { IUser, UserRole } from '@/types/models';
import { getRolePermissions } from './constants';
import mongoose from 'mongoose';

// ==========================================
// PERMISSION CHECKING
// ==========================================

/**
 * Check if permissions array includes a specific permission
 * Supports wildcards: "users:*" or "*:*"
 * 
 * @param userPermissions - User's permissions
 * @param requiredPermission - Required permission
 * @returns True if has permission
 */
export function hasPermission(
    userPermissions: Permission[],
    requiredPermission: Permission
): boolean {
    // Super admin check
    if (userPermissions.includes('*:*')) {
        return true;
    }

    // Exact match
    if (userPermissions.includes(requiredPermission)) {
        return true;
    }

    // Check category wildcard (e.g., "users:*" grants all user permissions)
    const [category] = requiredPermission.split(':');
    const categoryWildcard = `${category}:*` as Permission;

    if (userPermissions.includes(categoryWildcard)) {
        return true;
    }

    return false;
}

/**
 * Check if user has any of the required permissions
 * 
 * @param userPermissions - User's permissions
 * @param requiredPermissions - Array of required permissions (OR logic)
 * @returns True if has any permission
 */
export function hasAnyPermission(
    userPermissions: Permission[],
    requiredPermissions: Permission[]
): boolean {
    return requiredPermissions.some(permission =>
        hasPermission(userPermissions, permission)
    );
}

/**
 * Check if user has all required permissions
 * 
 * @param userPermissions - User's permissions
 * @param requiredPermissions - Array of required permissions (AND logic)
 * @returns True if has all permissions
 */
export function hasAllPermissions(
    userPermissions: Permission[],
    requiredPermissions: Permission[]
): boolean {
    return requiredPermissions.every(permission =>
        hasPermission(userPermissions, permission)
    );
}

// ==========================================
// USER-BASED PERMISSION CHECKING
// ==========================================

/**
 * Check if user has permission (cached)
 * 
 * @param user - User object
 * @param permission - Required permission
 * @returns True if has permission
 */
export const userHasPermission = cache((
    user: IUser | null,
    permission: Permission
): boolean => {
    if (!user) return false;

    const userPermissions = getUserPermissions(user);
    return hasPermission(userPermissions, permission);
});

/**
 * Check if user has any of the permissions (cached)
 */
export const userHasAnyPermission = cache((
    user: IUser | null,
    permissions: Permission[]
): boolean => {
    if (!user) return false;

    const userPermissions = getUserPermissions(user);
    return hasAnyPermission(userPermissions, permissions);
});

/**
 * Check if user has all permissions (cached)
 */
export const userHasAllPermissions = cache((
    user: IUser | null,
    permissions: Permission[]
): boolean => {
    if (!user) return false;

    const userPermissions = getUserPermissions(user);
    return hasAllPermissions(userPermissions, permissions);
});

// ==========================================
// ROLE-BASED CHECKING
// ==========================================

/**
 * Get all permissions for a user based on their role
 * Merges role permissions with custom database permissions
 * 
 * @param user - User object
 * @returns Array of permissions
 */
export function getUserPermissions(user: IUser): Permission[] {
    // Get base role permissions
    const rolePermissions = getRolePermissions(user.role);

    // ✨ Merge with custom permissions from database
    const customPermissions = (user.customPermissions || []) as Permission[];
    const overrides = (user.permissionOverrides || []) as Permission[];

    // Combine all permissions (deduplicate with Set)
    const allPermissions = [
        ...rolePermissions,
        ...customPermissions,
        ...overrides,
    ];

    return [...new Set(allPermissions)];
}

/**
 * Check if role has permission
 * 
 * @param role - User role
 * @param permission - Required permission
 * @returns True if role has permission
 */
export function roleHasPermission(
    role: UserRole,
    permission: Permission
): boolean {
    const rolePermissions = getRolePermissions(role);
    return hasPermission(rolePermissions, permission);
}

// ==========================================
// MIDDLEWARE HELPERS
// ==========================================

/**
 * Require specific permission (throws if not authorized)
 * Use in server actions
 * 
 * @param user - User object
 * @param permission - Required permission
 * @throws Error if not authorized
 */
export function requirePermission(
    user: IUser | null,
    permission: Permission
): void {
    if (!user) {
        throw new Error('Unauthorized - Please login');
    }

    if (!userHasPermission(user, permission)) {
        throw new Error(`Forbidden - Missing permission: ${permission}`);
    }
}

/**
 * Require any of the permissions (throws if not authorized)
 * 
 * @param user - User object
 * @param permissions - Required permissions (OR logic)
 * @throws Error if not authorized
 */
export function requireAnyPermission(
    user: IUser | null,
    permissions: Permission[]
): void {
    if (!user) {
        throw new Error('Unauthorized - Please login');
    }

    if (!userHasAnyPermission(user, permissions)) {
        throw new Error(`Forbidden - Missing any of: ${permissions.join(', ')}`);
    }
}

/**
 * Require all permissions (throws if not authorized)
 * 
 * @param user - User object
 * @param permissions - Required permissions (AND logic)
 * @throws Error if not authorized
 */
export function requireAllPermissions(
    user: IUser | null,
    permissions: Permission[]
): void {
    if (!user) {
        throw new Error('Unauthorized - Please login');
    }

    if (!userHasAllPermissions(user, permissions)) {
        throw new Error(`Forbidden - Missing permissions: ${permissions.join(', ')}`);
    }
}

// ==========================================
// SCOPE-BASED PERMISSIONS
// ==========================================

/**
 * Check if user can access specific resource
 * Implements row-level security
 * 
 * @param user - User object
 * @param resource - Resource to check (e.g., student, course)
 * @param action - Action to perform
 * @returns True if can access
 */
export function canAccessResource(
    user: IUser,
    resource: Record<string, unknown> & { userId?: string | mongoose.Types.ObjectId; centerId?: string | mongoose.Types.ObjectId; constructor?: { modelName?: string } },
    action: 'view' | 'update' | 'delete'
): boolean {
    // Super admin can access everything
    if (user.role === 'super-admin') {
        return true;
    }

    // Check if user is the owner
    if (resource.userId && resource.userId.toString() === user._id.toString()) {
        return true;
    }

    // Check if user's center matches resource's center
    if (user.role === 'center' && resource.centerId) {
        return user.centerId?.toString() === resource.centerId.toString();
    }

    // Check standard permissions
    const permission = `${getResourceType(resource)}:${action}` as Permission;
    return userHasPermission(user, permission);
}

/**
 * Get resource type from resource object
 * @param resource - Resource object
 * @returns Resource type
 */
function getResourceType(resource: Record<string, unknown> & { constructor?: { modelName?: string }; studentId?: unknown; courseId?: unknown; certificateNumber?: unknown }): string {
    // Try to infer from mongoose model name
    if (resource.constructor?.modelName) {
        return resource.constructor.modelName.toLowerCase();
    }

    // Fallback to checking properties
    if (resource.studentId) return 'students';
    if (resource.courseId) return 'courses';
    if (resource.certificateNumber) return 'certificates';

    return 'unknown';
}

// ==========================================
// PERMISSION FILTERING
// ==========================================

/**
 * Filter array based on user permissions
 * Useful for showing/hiding UI elements
 * 
 * @param items - Array of items with required permissions
 * @param user - User object
 * @returns Filtered array
 */
export function filterByPermissions<T extends { requiredPermission?: Permission }>(
    items: T[],
    user: IUser | null
): T[] {
    if (!user) return [];

    return items.filter(item => {
        if (!item.requiredPermission) return true;
        return userHasPermission(user, item.requiredPermission);
    });
}

// ==========================================
// EXPORTS
// ==========================================

export const PermissionChecker = {
    has: hasPermission,
    hasAny: hasAnyPermission,
    hasAll: hasAllPermissions,
    userHas: userHasPermission,
    userHasAny: userHasAnyPermission,
    userHasAll: userHasAllPermissions,
    require: requirePermission,
    requireAny: requireAnyPermission,
    requireAll: requireAllPermissions,
    canAccess: canAccessResource,
    filter: filterByPermissions,
} as const;
