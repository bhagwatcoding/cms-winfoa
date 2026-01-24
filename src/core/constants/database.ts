/**
 * Database-Related Dynamic Constants
 * These values can be fetched from database for dynamic configuration
 */

import {
    UserRole,
    UserStatus,
    TransactionType,
    TransactionStatus,
    NotificationType
} from '@/types';

// ==========================================
// USER ROLES & STATUS
// ==========================================

export const USER_ROLES = {
    GOD: UserRole.God,
    SUPER_ADMIN: UserRole.SuperAdmin,
    USER: UserRole.User,
} as const;

export const USER_STATUS = {
    ACTIVE: UserStatus.Active,
    INACTIVE: UserStatus.Inactive,
    SUSPENDED: UserStatus.Suspended,
    PENDING: UserStatus.Pending,
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

export const TRANSACTION_TYPES = {
    CREDIT: TransactionType.Credit,
    DEBIT: TransactionType.Debit,
} as const;

export const TRANSACTION_STATUS_MAP = {
    PENDING: TransactionStatus.Pending,
    COMPLETED: TransactionStatus.Completed,
    FAILED: TransactionStatus.Failed,
} as const;

export const TRANSACTION_TYPE_LABELS: Record<keyof typeof TRANSACTION_TYPES, string> = {
    CREDIT: 'Credit',
    DEBIT: 'Debit',
};

export const TRANSACTION_STATUS_LABELS: Record<keyof typeof TRANSACTION_STATUS_MAP, string> = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
};

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export const NOTIFICATION_TYPES_ENUM = {
    INFO: NotificationType.Info,
    SUCCESS: NotificationType.Success,
    WARNING: NotificationType.Warning,
    ERROR: NotificationType.Error,
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
export function getEnumOptions<K extends string, V>(
    enumObj: Record<K, V>,
    labels: Record<K, string>
): Array<{ value: V; label: string }> {
    return (Object.keys(enumObj) as K[]).map(key => ({
        value: enumObj[key],
        label: labels[key] || key,
    }));
}

// ==========================================
// PRE-BUILT OPTIONS
// ==========================================

export const USER_ROLE_OPTIONS = getEnumOptions(USER_ROLES, USER_ROLE_LABELS);
export const USER_STATUS_OPTIONS = getEnumOptions(USER_STATUS, USER_STATUS_LABELS);
export const TRANSACTION_TYPE_OPTIONS = getEnumOptions(TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS);
export const TRANSACTION_STATUS_OPTIONS = getEnumOptions(TRANSACTION_STATUS_MAP, TRANSACTION_STATUS_LABELS);
export const NOTIFICATION_TYPE_OPTIONS = getEnumOptions(NOTIFICATION_TYPES_ENUM, NOTIFICATION_TYPE_LABELS);
