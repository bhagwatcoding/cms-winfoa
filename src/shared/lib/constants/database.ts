/**
 * Database-Related Dynamic Constants
 * These values can be fetched from database for dynamic configuration
 */

import type {
    UserRole,
    UserStatus,
    StudentStatus,
    CourseLevel,
    CertificateStatus,
    TransactionType,
    TransactionStatus,
    NotificationType
} from '@/types/models';

// ==========================================
// USER ROLES & STATUS
// ==========================================

export const USER_ROLES: Record<string, UserRole> = {
    SUPER_ADMIN: 'super-admin',
    ADMIN: 'admin',
    STAFF: 'staff',
    STUDENT: 'student',
    USER: 'user',
    CENTER: 'center',
} as const;

export const USER_STATUS: Record<string, UserStatus> = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ON_LEAVE: 'on-leave',
} as const;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Administrator',
    'staff': 'Staff Member',
    'student': 'Student',
    'user': 'User',
    'center': 'Center',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
    'active': 'Active',
    'inactive': 'Inactive',
    'on-leave': 'On Leave',
};

// ==========================================
// STUDENT STATUS
// ==========================================

export const STUDENT_STATUS: Record<string, StudentStatus> = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DROPPED: 'dropped',
} as const;

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
    'active': 'Active',
    'completed': 'Completed',
    'dropped': 'Dropped',
};

// ==========================================
// COURSE LEVELS
// ==========================================

export const COURSE_LEVELS: Record<string, CourseLevel> = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
} as const;

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
};

// ==========================================
// CERTIFICATE STATUS
// ==========================================

export const CERTIFICATE_STATUS: Record<string, CertificateStatus> = {
    PENDING: 'pending',
    ISSUED: 'issued',
    REVOKED: 'revoked',
} as const;

export const CERTIFICATE_STATUS_LABELS: Record<CertificateStatus, string> = {
    'pending': 'Pending',
    'issued': 'Issued',
    'revoked': 'Revoked',
};

// ==========================================
// TRANSACTION TYPES & STATUS
// ==========================================

export const TRANSACTION_TYPES: Record<string, TransactionType> = {
    CREDIT: 'credit',
    DEBIT: 'debit',
} as const;

export const TRANSACTION_STATUS: Record<string, TransactionStatus> = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
} as const;

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    'credit': 'Credit',
    'debit': 'Debit',
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
    'pending': 'Pending',
    'completed': 'Completed',
    'failed': 'Failed',
};

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export const NOTIFICATION_TYPES_ENUM: Record<string, NotificationType> = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
} as const;

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
    'info': 'Information',
    'success': 'Success',
    'warning': 'Warning',
    'error': 'Error',
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
 * Course Categories - Can be dynamically loaded from database
 */
export const DEFAULT_COURSE_CATEGORIES = [
    'Computer Science',
    'Business Administration',
    'Engineering',
    'Healthcare',
    'Design',
    'Languages',
    'Other',
] as const;

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
    'Staff',
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
export const STUDENT_STATUS_OPTIONS = getEnumOptions(STUDENT_STATUS, STUDENT_STATUS_LABELS);
export const COURSE_LEVEL_OPTIONS = getEnumOptions(COURSE_LEVELS, COURSE_LEVEL_LABELS);
export const CERTIFICATE_STATUS_OPTIONS = getEnumOptions(CERTIFICATE_STATUS, CERTIFICATE_STATUS_LABELS);
export const TRANSACTION_TYPE_OPTIONS = getEnumOptions(TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS);
export const TRANSACTION_STATUS_OPTIONS = getEnumOptions(TRANSACTION_STATUS, TRANSACTION_STATUS_LABELS);
export const NOTIFICATION_TYPE_OPTIONS = getEnumOptions(NOTIFICATION_TYPES_ENUM, NOTIFICATION_TYPE_LABELS);
