/**
 * Subdomain Configuration
 * Define all subdomain types and mappings
 */

// ==========================================
// SUBDOMAIN TYPES
// ==========================================

export const SUBDOMAIN_TYPES = {
    ROOT: 'root',
    WWW: 'www',
    AUTH: 'auth',
    API: 'api',
    GOD: 'god',
    UMP: 'ump',
    ACADEMY: 'academy',
    SKILLS: 'skills', // Alias for academy
    PROVIDER: 'provider',
    MYACCOUNT: 'myaccount',
    WALLET: 'wallet',
    DEVELOPER: 'developer',
} as const;

export type SubDomainType = typeof SUBDOMAIN_TYPES[keyof typeof SUBDOMAIN_TYPES];

// ==========================================
// SUBDOMAIN ACCESS BY ROLE
// ==========================================

export const SUBDOMAIN_ACCESS_BY_ROLE: Record<string, string[]> = {
    'super-admin': ['auth', 'god', 'academy', 'skills', 'api', 'ump', 'provider', 'myaccount', 'wallet', 'developer'],
    'admin': ['auth', 'academy', 'skills', 'api', 'ump', 'myaccount', 'wallet'],
    'staff': ['auth', 'academy', 'skills', 'myaccount', 'wallet'],
    'center': ['auth', 'academy', 'skills', 'myaccount'],
    'provider': ['auth', 'provider', 'myaccount', 'wallet'],
    'student': ['auth', 'academy', 'skills', 'myaccount'],
    'user': ['auth', 'myaccount'],
};

// ==========================================
// PUBLIC SUBDOMAINS (No Auth Required)
// ==========================================

export const PUBLIC_SUBDOMAINS = ['www', 'auth'] as const;

// ==========================================
// APP SUBDOMAINS (Require Auth)
// ==========================================

export const APP_SUBDOMAINS = [
    'god',
    'ump',
    'provider',
    'academy',
    'myaccount',
    'wallet',
    'developer',
] as const;

// ==========================================
// SUBDOMAIN CONFIGURATION
// ==========================================

export const SUBDOMAIN_CONFIG = {
    TYPES: SUBDOMAIN_TYPES,
    PUBLIC: PUBLIC_SUBDOMAINS,
    APP: APP_SUBDOMAINS,
    ACCESS: SUBDOMAIN_ACCESS_BY_ROLE,
} as const;
