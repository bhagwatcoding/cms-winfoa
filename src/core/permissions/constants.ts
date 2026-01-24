
export type UserRole = 'god' | 'user' | 'admin' | 'staff';

// ==========================================
// PERMISSION CATEGORIES
// ==========================================

export const PERMISSION_CATEGORIES = {
    USERS: 'users',
    SETTINGS: 'settings',
    API: 'api',
    SYSTEM: 'system',
    TRANSACTIONS: 'transactions',
    REPORTS: 'reports',
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
 * - "*:*" - Super admin (all permissions)
 */
export type Permission = `${PermissionCategory}:${PermissionAction | '*'}` | '*:*';

// ==========================================
// PREDEFINED ROLE PERMISSIONS
// ==========================================

/**
 * Super Admin - Full system access
 */
export const GOD_PERMISSIONS: Permission[] = ['*:*'];

/**
 * User - Basic access
 */
export const USER_PERMISSIONS: Permission[] = [];

// ==========================================
// ROLE TO PERMISSIONS MAPPING
// ==========================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    'god': GOD_PERMISSIONS,
    'user': USER_PERMISSIONS,
    'admin': [], // Dynamic: fetched from DB
    'staff': [], // Dynamic: fetched from DB
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
    'Course Management': [
        'courses:view',
        'courses:create',
        'courses:update',
        'courses:delete',
    ],
    'Certificate Management': [
        'certificates:view',
        'certificates:create',
        'certificates:update',
    ],
    'Transaction Management': [
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
  '/god/system': ['system:manage'],

  // UMP
  '/ump': ['users:view'],
  '/ump/users': ['users:view'],
  '/ump/users/create': ['users:create'],
  '/ump/users/[id]': ['users:view', 'users:update'],
  
  // My Account
  '/myaccount': [], // Public for authenticated users

  // API Routes
  '/api/users': ['users:view', 'api:view'],
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
    GOD: GOD_PERMISSIONS,
    USER: USER_PERMISSIONS,
    ROLE_MAPPING: ROLE_PERMISSIONS,
    ROUTE_MAPPING: ROUTE_PERMISSIONS,
} as const;
