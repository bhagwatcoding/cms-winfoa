/**
 * Messages Constants
 * All user-facing messages for consistency
 */

// ==========================================
// SUCCESS MESSAGES
// ==========================================

export const SUCCESS_MESSAGES = {
    // Auth
    LOGIN_SUCCESS: 'Login successful! Redirecting...',
    SIGNUP_SUCCESS: 'Account created successfully!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email',
    PASSWORD_CHANGED: 'Password changed successfully',
    EMAIL_VERIFIED: 'Email verified successfully',

    // User
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    PROFILE_UPDATED: 'Profile updated successfully',

    // Student
    STUDENT_CREATED: 'Student created successfully',
    STUDENT_UPDATED: 'Student updated successfully',
    STUDENT_DELETED: 'Student deleted successfully',
    STUDENT_ENROLLED: 'Student enrolled successfully',

    // Course
    COURSE_CREATED: 'Course created successfully',
    COURSE_UPDATED: 'Course updated successfully',
    COURSE_DELETED: 'Course deleted successfully',

    // Certificate
    CERTIFICATE_ISSUED: 'Certificate issued successfully',
    CERTIFICATE_VERIFIED: 'Certificate is valid and verified',
    CERTIFICATE_REVOKED: 'Certificate revoked successfully',

    // Transaction
    TRANSACTION_COMPLETED: 'Transaction completed successfully',
    RECHARGE_SUCCESS: 'Wallet recharged successfully',

    // General
    SAVED: 'Changes saved successfully',
    DELETED: 'Deleted successfully',
    UPLOADED: 'File uploaded successfully',
} as const;

// ==========================================
// ERROR MESSAGES
// ==========================================

export const ERROR_MESSAGES = {
    // Auth
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized. Please login.',
    FORBIDDEN: 'You do not have permission to access this resource',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    ACCOUNT_INACTIVE: 'Your account is inactive. Please contact support.',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    WEAK_PASSWORD: 'Password is too weak',
    PASSWORD_MISMATCH: 'Passwords do not match',
    INVALID_TOKEN: 'Invalid or expired token',

    // User
    USER_NOT_FOUND: 'User not found',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',

    // Student
    STUDENT_NOT_FOUND: 'Student not found',
    STUDENT_ALREADY_ENROLLED: 'Student already enrolled in this course',

    // Course
    COURSE_NOT_FOUND: 'Course not found',
    COURSE_FULL: 'Course capacity reached',

    // Certificate
    CERTIFICATE_NOT_FOUND: 'Certificate not found',
    CERTIFICATE_INVALID: 'Invalid certificate number',
    CERTIFICATE_REVOKED: 'This certificate has been revoked',

    // Transaction
    INSUFFICIENT_BALANCE: 'Insufficient wallet balance',
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    INVALID_AMOUNT: 'Invalid transaction amount',

    // Validation
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PHONE: 'Invalid phone number',
    INVALID_DATE: 'Invalid date format',
    FILE_TOO_LARGE: 'File size exceeds maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type',

    // General
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
} as const;

// ==========================================
// INFO MESSAGES
// ==========================================

export const INFO_MESSAGES = {
    LOADING: 'Loading...',
    PROCESSING: 'Processing your request...',
    UPLOADING: 'Uploading file...',
    SAVING: 'Saving changes...',
    DELETING: 'Deleting...',
    NO_DATA: 'No data available',
    NO_RESULTS: 'No results found',
    CONFIRM_DELETE: 'Are you sure you want to delete this?',
    CONFIRM_LOGOUT: 'Are you sure you want to logout?',
    UNSAVED_CHANGES: 'You have unsaved changes. Do you want to leave?',
} as const;

// ==========================================
// VALIDATION MESSAGES
// ==========================================

export const VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    PASSWORD_STRENGTH: 'Password must contain uppercase, lowercase, and number',
    NAME_REQUIRED: 'Name is required',
    NAME_MIN_LENGTH: 'Name must be at least 2 characters',
    PHONE_INVALID: 'Please enter a valid phone number',
    DATE_REQUIRED: 'Date is required',
    DATE_INVALID: 'Please enter a valid date',
    AMOUNT_REQUIRED: 'Amount is required',
    AMOUNT_POSITIVE: 'Amount must be positive',
    AMOUNT_MAX: 'Amount exceeds maximum limit',
} as const;

// ==========================================
// CONFIRMATION MESSAGES
// ==========================================

export const CONFIRM_MESSAGES = {
    DELETE_USER: 'Are you sure you want to delete this user? This action cannot be undone.',
    DELETE_STUDENT: 'Are you sure you want to delete this student? This action cannot be undone.',
    DELETE_COURSE: 'Are you sure you want to delete this course? This action cannot be undone.',
    REVOKE_CERTIFICATE: 'Are you sure you want to revoke this certificate?',
    LOGOUT: 'Are you sure you want to logout?',
    CANCEL_TRANSACTION: 'Are you sure you want to cancel this transaction?',
    DISCARD_CHANGES: 'Are you sure you want to discard your changes?',
} as const;

// ==========================================
// PLACEHOLDER MESSAGES
// ==========================================

export const PLACEHOLDERS = {
    SEARCH: 'Search...',
    EMAIL: 'Enter your email',
    PASSWORD: 'Enter your password',
    NAME: 'Enter name',
    PHONE: 'Enter phone number',
    SELECT: 'Select an option',
    DATE: 'Select date',
    AMOUNT: 'Enter amount',
    DESCRIPTION: 'Enter description',
} as const;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get success message
 * @param key - Message key
 * @returns Success message
 */
export function getSuccessMessage(key: keyof typeof SUCCESS_MESSAGES): string {
    return SUCCESS_MESSAGES[key];
}

/**
 * Get error message
 * @param key - Message key
 * @returns Error message
 */
export function getErrorMessage(key: keyof typeof ERROR_MESSAGES): string {
    return ERROR_MESSAGES[key];
}

/**
 * Get validation message
 * @param key - Message key
 * @param params - Optional parameters for interpolation
 * @returns Validation message
 */
export function getValidationMessage(
    key: keyof typeof VALIDATION_MESSAGES,
    params?: Record<string, string | number>
): string {
    let message: string = VALIDATION_MESSAGES[key];

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            message = message.replace(`{${key}}`, String(value));
        });
    }

    return message;
}
