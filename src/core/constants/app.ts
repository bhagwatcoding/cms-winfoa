/**
 * Application Constants
 * Core application-level constants and configuration
 */
import { env } from "@/config/env";

// ==========================================
// ENVIRONMENT
// ==========================================

export const IS_PRODUCTION = env.NODE_ENV === "production";
export const IS_DEVELOPMENT = env.NODE_ENV === "development";
export const IS_TEST = env.NODE_ENV === "test";

// ==========================================
// APPLICATION INFO
// ==========================================

export const APP = {
  NAME: "winfoa",
  DESCRIPTION: "Modern Multi-Tenant Education Portal",
  VERSION: "1.0.0",
  AUTHOR: "Winfoa Team",
  DOMAIN: {
    NAME: env.NEXT_PUBLIC_ROOT_DOMAIN,
    ROOT: env.NEXT_PUBLIC_ROOT_DOMAIN,
    SUB: {
      API: "api",
      WALLET: "wallet",
    },
  },
  SUBDOMAIN: "",
  IS_PRODUCTION: env.NODE_ENV === "production",
  IS_DEVELOPMENT: env.NODE_ENV === "development",
  IS_TEST: env.NODE_ENV === "test",
  PROTOCOL: IS_PRODUCTION ? "https" : "http",
};

// ==========================================
// URLS & DOMAINS
// ==========================================

export const ROOT_DOMAIN = env.NEXT_PUBLIC_ROOT_DOMAIN;
export const ROOT_URL = env.NEXT_PUBLIC_APP_URL;
export const API_URL = env.NEXT_PUBLIC_APP_URL.replace("http://", "http://api.").replace("https://", "https://api.");

// ==========================================
// DATABASE
// ==========================================
export const MONGODB = {
  URI: env.MONGODB_URI,
  NAME: env.MONGODB_NAME,
};

// ==========================================
// SESSION & SECURITY
// ==========================================
export const SESSION = {
  COOKIE_NAME: "auth_session",
  MAX_AGE: 604800000, // 7 days
  SECRET: env.SESSION_SECRET,
};

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
  IMAGES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// ==========================================
// DATE & TIME
// ==========================================
export const CLOCK = Object.freeze({
  ASIA: "Asia/Kolkata",
  FORMAT: Object.freeze({
    DATE: "YYYY-MM-DD",
    TIME: "HH:mm:ss",
    DATETIME: "YYYY-MM-DD HH:mm:ss",
  }),
});
