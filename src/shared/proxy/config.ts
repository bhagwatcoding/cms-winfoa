/**
 * Proxy Configuration
 * Subdomain routing and security configuration for the proxy server
 */

import { SESSION, TENANCY, VALIDATION, env, SUBDOMAIN_CONFIG } from "@/config";
// import { SUBDOMAIN_CONFIG } from "@/lib/constants";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const getEnv = (key: string, defaultVal?: string): string => {
  const val = process.env[key] || defaultVal;
  if (!val) throw new Error(`CRITICAL ERROR: Missing Env Variable ${key}`);
  return val;
};

// ==========================================
// PROXY CONFIG
// ==========================================

export const PROXY_CONFIG = {
  ENV: env.NODE_ENV,
  ROOT_DOMAIN: TENANCY.ROOT_DOMAIN,
  COOKIE_NAME: SESSION.COOKIE.NAME,

  // Enterprise Security Flags
  ENABLE_WAF: true, // Web Application Firewall
  ENABLE_RATE_LIMIT: true,

  // Rate Limiting Rules
  RATE_LIMIT: {
    WINDOW_SECONDS: VALIDATION.RATE_LIMIT.API_WINDOW / 1000, // Convert ms to seconds
    MAX_REQUESTS: VALIDATION.RATE_LIMIT.API_REQUESTS,
  },

  // Bank-Grade Security Headers
  HEADERS: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-XSS-Protection": "1; mode=block",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=()",
  },

  // Routing Map - Using centralized subdomain config
  SUBDOMAINS: {
    APP: SUBDOMAIN_CONFIG.APP,
    PUBLIC: SUBDOMAIN_CONFIG.PUBLIC,
    AUTH: SUBDOMAIN_CONFIG.TYPES.AUTH,
    API: SUBDOMAIN_CONFIG.TYPES.API,
  },

  // Public Access Lists
  PUBLIC_PATHS: new Set([
    "/",
    "/login",
    "/signup",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ]),
  ASSETS: ["/_next", "/favicon.ico", "/images", "/api/public", "/public"],
} as const;

// Legacy export for backward compatibility
export const CONFIG = PROXY_CONFIG;
