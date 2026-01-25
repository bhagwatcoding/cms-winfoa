/**
 * Application Constants
 * Core application-level constants
 *
 * NOTE: Runtime configuration (env-based) is in src/config/
 * This file contains static constants only.
 */
import { env } from '@/config/env';

// ==========================================
// ENVIRONMENT FLAGS (Convenience re-exports)
// ==========================================

export const IS_PROD = env.NODE_ENV === 'production';
export const IS_DEV = env.NODE_ENV === 'development';
export const IS_TEST = env.NODE_ENV === 'test';

// ==========================================
// DATE & TIME
// ==========================================

export const CLOCK = Object.freeze({
  TIMEZONE: 'Asia/Kolkata',
  FORMAT: Object.freeze({
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
  }),
});

// ==========================================
// HTTP STATUS CODES
// ==========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
