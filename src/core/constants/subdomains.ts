/**
 * Subdomain Configuration
 * Define all subdomain types and mappings
 *
 * NOTE: This file now derives from src/config/subdomains.ts to ensure
 * a single source of truth.
 */

import {
  SUBDOMAINS,
  PUBLIC_SUBDOMAINS as CONFIG_PUBLIC,
  PROTECTED_SUBDOMAINS as CONFIG_PROTECTED,
  SUBDOMAIN_ACCESS_BY_ROLE as CONFIG_ACCESS,
} from '@/config/subdomains';

// ==========================================
// SUBDOMAIN TYPES
// ==========================================

// Re-map for backward compatibility if needed, or just re-export
export const SUBDOMAIN_TYPES = SUBDOMAINS;

export type SubDomainType = (typeof SUBDOMAIN_TYPES)[keyof typeof SUBDOMAIN_TYPES];

// ==========================================
// SUBDOMAIN ACCESS BY ROLE
// ==========================================

export const SUBDOMAIN_ACCESS_BY_ROLE = CONFIG_ACCESS;

// ==========================================
// PUBLIC SUBDOMAINS (No Auth Required)
// ==========================================

export const PUBLIC_SUBDOMAINS = CONFIG_PUBLIC;

// ==========================================
// APP SUBDOMAINS (Require Auth)
// ==========================================

export const APP_SUBDOMAINS = CONFIG_PROTECTED;

// ==========================================
// SUBDOMAIN CONFIGURATION
// ==========================================

export const SUBDOMAIN_CONFIG = {
  TYPES: SUBDOMAIN_TYPES,
  PUBLIC: PUBLIC_SUBDOMAINS,
  APP: APP_SUBDOMAINS,
  ACCESS: SUBDOMAIN_ACCESS_BY_ROLE,
} as const;
