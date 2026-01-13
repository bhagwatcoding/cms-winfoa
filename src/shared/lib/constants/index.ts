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
// SUBDOMAINS
// ==========================================

export * from './subdomains';

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
    SUBDOMAIN_TYPES,
    SUBDOMAIN_CONFIG,
    type SubDomainType,
} from './subdomains';
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
