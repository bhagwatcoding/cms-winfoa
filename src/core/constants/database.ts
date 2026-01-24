/**
 * Database-Related Dynamic Constants
 * These values can be fetched from database for dynamic configuration
 */

import {
    USER_ROLE,
    USER_STATUS as USER_STATUS_ENUM,
    TRANSACTION_TYPE,
    TRANSACTION_STATUS as TRANSACTION_STATUS_ENUM,
    NOTIFICATION_TYPE
} from '@/types';

// ==========================================
// USER ROLES & STATUS
// ==========================================

export const USER_ROLES: Record<string, USER_ROLE> = {
    GOD: USER_ROLE.GOD,
    SUPER_ADMIN: USER_ROLE.SUPER_ADMIN,
    USER: USER_ROLE.USER,
} as const;

export const USER_STATUS: Record<string, USER_STATUS_ENUM> = {
    ACTIVE: USER_STATUS_ENUM.ACTIVE,
    INACTIVE: USER_STATUS_ENUM.INACTIVE,
    SUSPENDED: USER_STATUS_ENUM.SUSPENDED,
    PENDING: USER_STATUS_ENUM.PENDING,
} as const;

export const USER_ROLE_LABELS: Record<keyof typeof USER_ROLES, string> = {
    GOD: 'God',
    SUPER_ADMIN: 'Super Administrator',
    USER: 'User',
};

export const USER_STATUS_LABELS: Record<keyof typeof USER_STATUS, string> = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended',
    PENDING: 'Pending',
};

// ==========================================
// TRANSACTION TYPES & STATUS
// ==========================================

export const TRANSACTION_TYPES: Record<string, TRANSACTION_TYPE> = {
    CREDIT: TRANSACTION_TYPE.CREDIT,
    DEBIT: TRANSACTION_TYPE.DEBIT,
} as const;

export const TRANSACTION_STATUS: Record<string, TRANSACTION_STATUS_ENUM> = {
    PENDING: TRANSACTION_STATUS_ENUM.PENDING,
    COMPLETED: TRANSACTION_STATUS_ENUM.COMPLETED,
    FAILED: TRANSACTION_STATUS_ENUM.FAILED,
} as const;

export const TRANSACTION_TYPE_LABELS: Record<keyof typeof TRANSACTION_TYPES, string> = {
    CREDIT: 'Credit',
    DEBIT: 'Debit',
};

export const TRANSACTION_STATUS_LABELS: Record<keyof typeof TRANSACTION_STATUS, string> = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
};

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export const NOTIFICATION_TYPES_ENUM: Record<string, NOTIFICATION_TYPE> = {
    INFO: NOTIFICATION_TYPE.INFO,
    SUCCESS: NOTIFICATION_TYPE.SUCCESS,
    WARNING: NOTIFICATION_TYPE.WARNING,
    ERROR: NOTIFICATION_TYPE.ERROR,
} as const;

export const NOTIFICATION_TYPE_LABELS: Record<keyof typeof NOTIFICATION_TYPES_ENUM, string> = {
    INFO: 'Information',
    SUCCESS: 'Success',
    WARNING: 'Warning',
    ERROR: 'Error',
};

// ==========================================
// GENDER OPTIONS
// ==========================================

export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
] as const;

// ==========================================
// GRADE OPTIONS
// ==========================================

export const GRADE_OPTIONS = [
    { value: 'A+', label: 'A+' },
    { value: 'A', label: 'A' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B', label: 'B' },
    { value: 'B-', label: 'B-' },
    { value: 'C+', label: 'C+' },
    { value: 'C', label: 'C' },
    { value: 'C-', label: 'C-' },
    { value: 'D', label: 'D' },
    { value: 'F', label: 'F' },
] as const;

// ==========================================
// DYNAMIC CONFIGURATION (Can be fetched from DB)
// ==========================================
/**
 * Department Options - Can be dynamically loaded from database
 */
export const DEFAULT_DEPARTMENTS = [
    'Administration',
    'Academic',
    'IT & Support',
    'Finance',
    'Operations',
    'Marketing',
] as const;

/**
 * Designation Options - Can be dynamically loaded from database
 */
export const DEFAULT_DESIGNATIONS = [
    'Director',
    'Manager',
    'Coordinator',
    'Faculty',
    'Assistant',
] as const;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get label for any enum value
 * @param value - Enum value
 * @param labels - Label mapping
 * @returns Label or value if not found
 */
export function getEnumLabel<T extends string>(
    value: T,
    labels: Record<T, string>
): string {
    return labels[value] || value;
}

/**
 * Get all options from enum with labels
 * @param enumObj - Enum object
 * @param labels - Label mapping
 * @returns Array of {value, label} options
 */
export function getEnumOptions<T extends string>(
    enumObj: Record<string, T>,
    labels: Record<T, string>
): Array<{ value: T; label: string }> {
    return Object.values(enumObj).map(value => ({
        value,
        label: labels[value] || value,
    }));
}

// ==========================================
// PRE-BUILT OPTIONS
// ==========================================

export const USER_ROLE_OPTIONS = getEnumOptions(USER_ROLES, USER_ROLE_LABELS);
export const USER_STATUS_OPTIONS = getEnumOptions(USER_STATUS, USER_STATUS_LABELS);
export const TRANSACTION_TYPE_OPTIONS = getEnumOptions(TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS);
export const TRANSACTION_STATUS_OPTIONS = getEnumOptions(TRANSACTION_STATUS, TRANSACTION_STATUS_LABELS);
export const NOTIFICATION_TYPE_OPTIONS = getEnumOptions(NOTIFICATION_TYPES_ENUM, NOTIFICATION_TYPE_LABELS);
