/**
 * Proxy Configuration
 * Subdomain routing and security configuration for the proxy server
 */

import {
  SESSION_COOKIE_NAME,
  SUBDOMAIN_CONFIG,
  ROOT_DOMAIN,
  IS_PRODUCTION,
} from '@/lib/constants';

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
  ENV: process.env.NODE_ENV || 'development',
  ROOT_DOMAIN: ROOT_DOMAIN,
  AUTH_COOKIE: SESSION_COOKIE_NAME,

  // Enterprise Security Flags
  ENABLE_WAF: true, // Web Application Firewall
  ENABLE_RATE_LIMIT: true,

  // Rate Limiting Rules
  RATE_LIMIT: {
    WINDOW_SECONDS: 60,
    MAX_REQUESTS: 150, // High traffic capacity
  },

  // Bank-Grade Security Headers
  HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=()',
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
    '/',
    '/login',
    '/signup',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
  ]),
  ASSETS: ['/_next', '/favicon.ico', '/images', '/api/public', '/public'],
} as const;

// Legacy export for backward compatibility
export const CONFIG = PROXY_CONFIG;
