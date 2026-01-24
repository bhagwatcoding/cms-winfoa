/**
 * Permission System - Central Export
 */

// ==========================================
// CONSTANTS
// ==========================================

export * from './constants';

// ==========================================
// PERMISSION CHECKING
// ==========================================

export * from './checker';

// ==========================================
// RE-EXPORTS FOR CONVENIENCE
// ==========================================

export {
    SUPER_ADMIN_PERMISSIONS,
    ADMIN_PERMISSIONS,
    STAFF_PERMISSIONS,
    CENTER_PERMISSIONS,
    STUDENT_PERMISSIONS,
    USER_PERMISSIONS,
    ROLE_PERMISSIONS,
    PERMISSION_LABELS,
    PERMISSION_GROUPS,
    type Permission,
    type PermissionCategory,
    type PermissionAction,
} from './constants';

export {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userHasPermission,
    userHasAnyPermission,
    userHasAllPermissions,
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    canAccessResource,
    getUserPermissions,
    PermissionChecker,
} from './checker';
