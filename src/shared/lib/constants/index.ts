/**
 * Constants - Central Export
 * All application constants organized and exported
 */

// ==========================================
// APPLICATION CONSTANTS
// ==========================================

export * from './app';

// ==========================================
// ROUTES
// ==========================================

export * from './routes';

// ==========================================
// DATABASE ENUMS & LABELS
// ==========================================

export * from './database';

// ==========================================
// MESSAGES
// ==========================================

export * from './messages';

// ==========================================
// RE-EXPORTS FOR CONVENIENCE
// ==========================================

export { Constants } from './app';
export { ROUTES } from './routes';
export {
    USER_ROLES,
    USER_STATUS,
    STUDENT_STATUS,
    COURSE_LEVELS,
    CERTIFICATE_STATUS,
    TRANSACTION_TYPES,
    TRANSACTION_STATUS,
} from './database';
export {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    INFO_MESSAGES,
    VALIDATION_MESSAGES,
} from './messages';
