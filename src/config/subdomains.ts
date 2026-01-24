// config/subdomains.ts
// ==========================================
// 1. DEFINITIONS & TYPES
// ==========================================

export const SUBDOMAINS = {
  ROOT: "root", // usually for landing page
  WWW: "www",
  AUTH: "auth",
  API: "api",
  MYACCOUNT: "myaccount",
  GOD: "god", // Super admin panel
  UMP: "ump",
  WALLET: "wallet",
} as const;

export type Subdomain = (typeof SUBDOMAINS)[keyof typeof SUBDOMAINS];

// Define Roles explicitly to prevent typos in keys
export type UserRole =
  | "god"
  | "admin"
  | "user";

// ==========================================
// 2. CATEGORIZATION (Flat Arrays)
// ==========================================

/**
 * Subdomains that do not require authentication.
 * Note: 'god' is often kept public (login page) but protected by middleware logic.
 */
export const PUBLIC_SUBDOMAINS: Subdomain[] = [
  SUBDOMAINS.ROOT,
  SUBDOMAINS.WWW,
  SUBDOMAINS.AUTH,
  // Usually the login page itself is public, but the dashboard inside is protected
];

/**
 * Subdomains that explicitly require a valid session.
 */
export const PROTECTED_SUBDOMAINS: Subdomain[] = [
  SUBDOMAINS.GOD, // Moved GOD here (usually you want the route protected)
  SUBDOMAINS.UMP,
  SUBDOMAINS.MYACCOUNT,
  SUBDOMAINS.WALLET,
];

// ==========================================
// 3. ACCESS CONTROL MATRIX
// ==========================================

export const SUBDOMAIN_ACCESS_BY_ROLE: Record<UserRole, Subdomain[]> = {
  god: [
    SUBDOMAINS.AUTH,
    SUBDOMAINS.GOD,
    SUBDOMAINS.UMP,
    SUBDOMAINS.MYACCOUNT,
    SUBDOMAINS.WALLET,
  ],
  admin: [
    SUBDOMAINS.AUTH,
    SUBDOMAINS.API,
    SUBDOMAINS.UMP,
    SUBDOMAINS.MYACCOUNT,
    SUBDOMAINS.WALLET,
  ],
  user: [SUBDOMAINS.AUTH, SUBDOMAINS.MYACCOUNT, SUBDOMAINS.WALLET],
};

// ==========================================
// 4. CONFIGURATION OBJECT
// ==========================================

export const SUBDOMAIN_CONFIG = {
  TYPES: SUBDOMAINS,
  APP: PROTECTED_SUBDOMAINS,
  PUBLIC: PUBLIC_SUBDOMAINS,
};
