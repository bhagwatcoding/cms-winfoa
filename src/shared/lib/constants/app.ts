/**
 * Application Constants
 * Core application-level constants and configuration
 */

// ==========================================
// NODE ENV VARIABLES
// ==========================================
export const IS_PROCUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
export const IS_TEST = process.env.NODE_ENV === "test";

// ==========================================
// APPLICATION INFO
// ==========================================

export const APP = {
  NAME: process.env.APP_NAME || "winfoa",
  DESCRIPTION: process.env.APP_DESCRIPTION || "Modern Multi-Tenant Education Portal",
  VERSION: process.env.APP_VERSION || "1.0.0",
  AUTHOR: process.env.APP_AUTHOR || "Winfoa Team",
  DOMAIN: {
    NAME: process.env.ROOT_DOMAIN || "localhost:3000",
    ROOT: process.env.ROOT_DOMAIN || "localhost:3000",
    SUB: {
      API: "api"
    },
  },
  SUBDOMAIN: "",
  IS_PROCUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_TEST: process.env.NODE_ENV === "test",
  PROTOCOL: IS_PROCUCTION ? "https" : "http"
}

// ==========================================
// ENVIRONMENT
// ==========================================


// export const IS_PRODUCTION = process.env.NODE_ENV === "production";
// export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
// export const IS_TEST = process.env.NODE_ENV === "test";

// ==========================================
// URLS & DOMAINS
// ==========================================

export const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "localhost:3000";
export const API_URL = process.env.API_URL || "http://localhost:3000";
// export const PROTOCOL = IS_PRODUCTION ? "https" : "http";

// ==========================================
// DATABASE
// ==========================================
export const MONGODB = {
  URI: process.env.MONGODB_URI || "mongodb://localhost:27017/winfoa",
  NAME: process.env.MONGODB_NAME || "winfoa"
}

// ==========================================
// SESSION & SECURITY
// ==========================================
export const SESSION = {
  COOKIE_NAME: process.env.SESSION_COOKIE_NAME || "auth_session",
  MAX_AGE: parseInt(process.env.SESSION_MAX_AGE || "604800000"),
  SECRET: process.env.SESSION_SECRET || "fallback-secret-key-change-in-production",
}

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
export const ALLOW_TYPES = {
  IMAGES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",]
}

// ==========================================
// DATE & TIME
// ==========================================
export const TIMEZONE = {
  ASIA: process.env.TIMEZONE || "Asia/Kolkata",
  FORMAT: {
    DATE: "YYYY-MM-DD",
    TIME: "HH:mm:ss",
    DATETIME: "YYYY-MM-DD HH:mm:ss"
  }
}
// export const DATE_FORMAT = "YYYY-MM-DD";
// export const TIME_FORMAT = "HH:mm:ss";
// export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
// export const TIMEZONE = process.env.TIMEZONE || "Asia/Kolkata";

// ==========================================
// VALIDATION
// ==========================================

export const LENGTH = {
  MIN: {
    PASSWORD: 6,
    NAME: 2,
    PHONE: 10,
  },
  MAX: {
    PASSWORD: 100,
    NAME: 100,
    PHONE: 15,
  }
}


export const REGEX = {
  PHONE: /^\+?[1-9]\d{1,14}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

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

export const CURRENCY = "INR";
export const CURRENCY_SYMBOL = "₹";
export const MIN_TRANSACTION_AMOUNT = 1;
export const MAX_TRANSACTION_AMOUNT = 1000000;

// ==========================================
// NOTIFICATIONS
// ==========================================

export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
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
