/**
 * Application Constants
 * Core application-level constants and configuration
 */

// ==========================================
// APPLICATION INFO
// ==========================================

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'WINFOA';
export const APP_DESCRIPTION = 'Modern Multi-Tenant Education Portal';
export const APP_VERSION = '1.0.0';
export const APP_AUTHOR = 'WINFOA Team';

// ==========================================
// ENVIRONMENT
// ==========================================

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_TEST = process.env.NODE_ENV === 'test';

// ==========================================
// URLS & DOMAINS
// ==========================================

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const PROTOCOL = IS_PRODUCTION ? 'https' : 'http';

// ==========================================
// DATABASE
// ==========================================

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/winfoa';
export const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'winfoa';

// ==========================================
// SESSION & SECURITY
// ==========================================

export const SESSION_COOKIE_NAME = 'auth_session';
export const SESSION_MAX_AGE = parseInt(process.env.SESSION_MAX_AGE || '604800000'); // 7 days
export const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production';

// ==========================================
// PAGINATION
// ==========================================

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// ==========================================
// FILE UPLOAD
// ==========================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as const;

// ==========================================
// DATE & TIME
// ==========================================

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIMEZONE = process.env.TIMEZONE || 'Asia/Kolkata';

// ==========================================
// VALIDATION
// ==========================================

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 100;
export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 100;
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// CACHE
// ==========================================

export const CACHE_TTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    DAY: 86400, // 24 hours
} as const;

// ==========================================
// RATE LIMITING
// ==========================================

export const RATE_LIMIT = {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS: 100,
    API_WINDOW: 60 * 1000, // 1 minute
} as const;

// ==========================================
// PRICING & BILLING
// ==========================================

export const CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';
export const MIN_TRANSACTION_AMOUNT = 1;
export const MAX_TRANSACTION_AMOUNT = 1000000;

// ==========================================
// NOTIFICATIONS
// ==========================================

export const NOTIFICATION_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
} as const;

// ==========================================
// EXPORTS
// ==========================================

export const Constants = {
    APP_NAME,
    APP_DESCRIPTION,
    APP_VERSION,
    IS_PRODUCTION,
    IS_DEVELOPMENT,
    ROOT_DOMAIN,
    API_URL,
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    DATE_FORMAT,
    DATETIME_FORMAT,
    TIMEZONE,
    CURRENCY,
    CURRENCY_SYMBOL,
} as const;
