/**
 * Permission Checking Utilities
 * High-performance permission validation with caching
 */

import { cache } from 'react';
import type { Permission } from './constants';
import type { IUser } from '@/core/db/models';
import type { SessionUser } from '@/core/auth';

import type { UserRole } from './constants';
import { getRolePermissions } from './constants';
import mongoose from 'mongoose';

// ==========================================
// TYPES
// ==========================================

export type UserContext = IUser | SessionUser;

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
    if (userPermissions.includes('*:*')) return true;

    // Exact match
    if (userPermissions.includes(requiredPermission)) return true;

    // Check category wildcard (e.g., "users:*" grants all user permissions)
    const [category] = requiredPermission.split(':');
    const categoryWildcard = `${category}:*` as Permission;

    if (userPermissions.includes(categoryWildcard)) return true;

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
    user: UserContext | null,
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
    user: UserContext | null,
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
    user: UserContext | null,
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
export function getUserPermissions(user: UserContext): Permission[] {
    // 1. GOD MODE: If user is God, they have ALL permissions
    if (user.isGod || user.role === 'god') {
        return ['*:*'];
    }

    // 2. Resolve Role Permissions
    let rolePermissions: Permission[] = [];
    
    // Case A: User has populated role object (IUser with populated roleId)
    if (user.roleId && typeof user.roleId === 'object' && 'permissions' in user.roleId) {
        rolePermissions = (user.roleId as any).permissions || [];
    }
    // Case B: User has role string (SessionUser or unpopulated IUser)
    // Fallback to static constants ONLY if DB role lookup isn't available
    else if (user.role) {
         rolePermissions = getRolePermissions(user.role as UserRole);
    }

    // 3. Custom Overrides (from User document)
    const customPermissions = (user.customPermissions || []) as Permission[];
    
    // 4. Combine and Deduplicate
    const allPermissions = [
        ...rolePermissions,
        ...customPermissions,
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
    user: UserContext | null,
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
    user: UserContext | null,
    permissions: Permission[]
): void {
    if (!user) throw new Error('Unauthorized - Please login');

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
    user: UserContext | null,
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
    user: UserContext,
    resource: Record<string, unknown> & { userId?: string | mongoose.Types.ObjectId; centerId?: string | mongoose.Types.ObjectId; constructor?: { modelName?: string } },
    action: 'view' | 'update' | 'delete'
): boolean {
    // Super admin can access everything
    if (user.role === 'god') {
        return true;
    }

    // Check if user is the owner
        // For SessionUser, user.id is the ID. For IUser, user._id is the ID.
        const userId = 'id' in user ? user.id : user._id.toString();
        if (resource.userId && resource.userId.toString() === userId) {
            return true;
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
