

import type { UserRole } from '@/types/models';

// ==========================================
// PERMISSION CATEGORIES
// ==========================================

export const PERMISSION_CATEGORIES = {
    USERS: 'users',
    STUDENTS: 'students',
    COURSES: 'courses',
    CERTIFICATES: 'certificates',
    CENTERS: 'centers',
    EMPLOYEES: 'employees',
    TRANSACTIONS: 'transactions',
    REPORTS: 'reports',
    SETTINGS: 'settings',
    API: 'api',
    SYSTEM: 'system',
} as const;

export type PermissionCategory = typeof PERMISSION_CATEGORIES[keyof typeof PERMISSION_CATEGORIES];

// ==========================================
// PERMISSION ACTIONS
// ==========================================

export const PERMISSION_ACTIONS = {
    VIEW: 'view',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    MANAGE: 'manage', // Full control
    EXPORT: 'export',
    IMPORT: 'import',
    APPROVE: 'approve',
    REJECT: 'reject',
} as const;

export type PermissionAction = typeof PERMISSION_ACTIONS[keyof typeof PERMISSION_ACTIONS];

// ==========================================
// PERMISSION FORMAT
// ==========================================

/**
 * Permission format: "category:action"
 * Examples:
 * - "users:view" - Can view users
 * - "users:create" - Can create users
 * - "users:manage" - Full user management
 * - "students:*" - All student permissions
 * - "*:*" - Super admin (all permissions)
 */
export type Permission = `${PermissionCategory}:${PermissionAction | '*'}` | '*:*';

// ==========================================
// PREDEFINED ROLE PERMISSIONS
// ==========================================

/**
 * Super Admin - Full system access
 */
export const SUPER_ADMIN_PERMISSIONS: Permission[] = ['*:*'];

/**
 * Admin - User management and operations
 */
export const ADMIN_PERMISSIONS: Permission[] = [
    'users:view',
    'users:create',
    'users:update',
    'users:delete',
    'employees:view',
    'employees:create',
    'employees:update',
    'centers:view',
    'reports:view',
    'reports:export',
    'settings:view',
    'settings:update',
];

/**
 * Staff - Limited management access
 */
export const STAFF_PERMISSIONS: Permission[] = [
    'users:view',
    'students:view',
    'students:create',
    'students:update',
    'courses:view',
    'certificates:view',
    'reports:view',
];

/**
 * Center - Center-specific management
 */
export const CENTER_PERMISSIONS: Permission[] = [
    'students:view',
    'students:create',
    'students:update',
    'courses:view',
    'certificates:view',
    'certificates:create',
    'employees:view',
    'reports:view',
];

/**
 * Student - Read-only access to own data
 */
export const STUDENT_PERMISSIONS: Permission[] = [
    'students:view', // Own data only
    'courses:view',
    'certificates:view',
    'transactions:view',
];

/**
 * User - Basic access
 */
export const USER_PERMISSIONS: Permission[] = [
    'courses:view',
    'certificates:view',
];

// ==========================================
// ROLE TO PERMISSIONS MAPPING
// ==========================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    'super-admin': SUPER_ADMIN_PERMISSIONS,
    'admin': ADMIN_PERMISSIONS,
    'staff': STAFF_PERMISSIONS,
    'center': CENTER_PERMISSIONS,
    'student': STUDENT_PERMISSIONS,
    'user': USER_PERMISSIONS,
};

// ==========================================
// PERMISSION LABELS (For UI)
// ==========================================

export const PERMISSION_LABELS: Record<string, string> = {
    // Users
    'users:view': 'View Users',
    'users:create': 'Create Users',
    'users:update': 'Update Users',
    'users:delete': 'Delete Users',
    'users:manage': 'Manage Users',

    // Students
    'students:view': 'View Students',
    'students:create': 'Create Students',
    'students:update': 'Update Students',
    'students:delete': 'Delete Students',
    'students:manage': 'Manage Students',

    // Courses
    'courses:view': 'View Courses',
    'courses:create': 'Create Courses',
    'courses:update': 'Update Courses',
    'courses:delete': 'Delete Courses',
    'courses:manage': 'Manage Courses',

    // Certificates
    'certificates:view': 'View Certificates',
    'certificates:create': 'Issue Certificates',
    'certificates:update': 'Update Certificates',
    'certificates:delete': 'Revoke Certificates',
    'certificates:approve': 'Approve Certificates',

    // Centers
    'centers:view': 'View Centers',
    'centers:create': 'Create Centers',
    'centers:update': 'Update Centers',
    'centers:delete': 'Delete Centers',

    // Employees
    'employees:view': 'View Employees',
    'employees:create': 'Create Employees',
    'employees:update': 'Update Employees',
    'employees:delete': 'Delete Employees',

    // Transactions
    'transactions:view': 'View Transactions',
    'transactions:create': 'Create Transactions',
    'transactions:approve': 'Approve Transactions',

    // Reports
    'reports:view': 'View Reports',
    'reports:export': 'Export Reports',

    // Settings
    'settings:view': 'View Settings',
    'settings:update': 'Update Settings',

    // API
    'api:view': 'Access API',
    'api:manage': 'Manage API Keys',

    // System
    'system:manage': 'System Administration',
    'system:logs': 'View System Logs',

    // Special
    '*:*': 'Full System Access',
};

// ==========================================
// PERMISSION GROUPS (For UI Organization)
// ==========================================

export const PERMISSION_GROUPS = {
    'User Management': [
        'users:view',
        'users:create',
        'users:update',
        'users:delete',
        'users:manage',
    ],
    'Student Management': [
        'students:view',
        'students:create',
        'students:update',
        'students:delete',
        'students:manage',
    ],
    'Course Management': [
        'courses:view',
        'courses:create',
        'courses:update',
        'courses:delete',
        'courses:manage',
    ],
    'Certificate Management': [
        'certificates:view',
        'certificates:create',
        'certificates:update',
        'certificates:delete',
        'certificates:approve',
    ],
    'Center Management': [
        'centers:view',
        'centers:create',
        'centers:update',
        'centers:delete',
    ],
    'Employee Management': [
        'employees:view',
        'employees:create',
        'employees:update',
        'employees:delete',
    ],
    'Financial': [
        'transactions:view',
        'transactions:create',
        'transactions:approve',
    ],
    'Reports & Analytics': [
        'reports:view',
        'reports:export',
    ],
    'System': [
        'settings:view',
        'settings:update',
        'api:view',
        'api:manage',
        'system:manage',
        'system:logs',
    ],
} as const;

// ==========================================
// ROUTE PERMISSIONS MAPPING
// ==========================================

/**
 * Map routes to required permissions
 * Used for automatic access control
 */
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
    // God Panel
    '/god': ['*:*'],
    '/god/users': ['users:view', 'users:manage'],
    '/god/centers': ['centers:view', 'centers:manage'],
    '/god/system': ['system:manage'],

    // UMP
    '/ump': ['users:view'],
    '/ump/users': ['users:view'],
    '/ump/users/create': ['users:create'],
    '/ump/users/[id]': ['users:view', 'users:update'],
    '/ump/employees': ['employees:view'],

    // Skills Portal
    '/skills': ['students:view', 'courses:view'],
    '/skills/students': ['students:view'],
    '/skills/students/create': ['students:create'],
    '/skills/courses': ['courses:view'],
    '/skills/certificates': ['certificates:view'],
    '/skills/certificates/issue': ['certificates:create'],

    // My Account
    '/myaccount': [], // Public for authenticated users
    '/myaccount/wallet': ['transactions:view'],

    // API Routes
    '/api/users': ['users:view', 'api:view'],
    '/api/students': ['students:view', 'api:view'],
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get all permissions for a role
 * @param role - User role
 * @returns Array of permissions
 */
export function getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
}

/**
 * Get permission label for display
 * @param permission - Permission string
 * @returns Human-readable label
 */
export function getPermissionLabel(permission: Permission): string {
    return PERMISSION_LABELS[permission] || permission;
}

/**
 * Get all available permissions
 * @returns Array of all permissions
 */
export function getAllPermissions(): Permission[] {
    return Object.keys(PERMISSION_LABELS) as Permission[];
}

/**
 * Get permissions by category
 * @param category - Permission category
 * @returns Array of permissions in category
 */
export function getPermissionsByCategory(category: PermissionCategory): Permission[] {
    return getAllPermissions().filter(p => p.startsWith(`${category}:`));
}

/**
 * Build permission options for UI
 * @returns Array of {value, label, group} for dropdowns
 */
export function getPermissionOptions() {
    const options: Array<{ value: Permission; label: string; group: string }> = [];

    Object.entries(PERMISSION_GROUPS).forEach(([group, permissions]) => {
        permissions.forEach(permission => {
            options.push({
                value: permission as Permission,
                label: getPermissionLabel(permission as Permission),
                group,
            });
        });
    });

    return options;
}

// ==========================================
// EXPORTS
// ==========================================

export const Permissions = {
    SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
    ADMIN: ADMIN_PERMISSIONS,
    STAFF: STAFF_PERMISSIONS,
    CENTER: CENTER_PERMISSIONS,
    STUDENT: STUDENT_PERMISSIONS,
    USER: USER_PERMISSIONS,
    ROLE_MAPPING: ROLE_PERMISSIONS,
    ROUTE_MAPPING: ROUTE_PERMISSIONS,
} as const;
