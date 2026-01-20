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
  WALLET: "wallet",
  GOD: "god", // Super admin panel
  UMP: "ump",
  PROVIDER: "provider",
  ACADEMY: "academy",
} as const;

export type Subdomain = (typeof SUBDOMAINS)[keyof typeof SUBDOMAINS];

// Define Roles explicitly to prevent typos in keys
export type UserRole =
  | "super-admin"
  | "admin"
  | "staff"
  | "center"
  | "provider"
  | "student"
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
  SUBDOMAINS.PROVIDER,
  SUBDOMAINS.WALLET,
  SUBDOMAINS.MYACCOUNT,
  SUBDOMAINS.ACADEMY,
];

// ==========================================
// 3. ACCESS CONTROL MATRIX
// ==========================================

export const SUBDOMAIN_ACCESS_BY_ROLE: Record<UserRole, Subdomain[]> = {
  "super-admin": [
    SUBDOMAINS.AUTH,
    SUBDOMAINS.GOD,
    SUBDOMAINS.ACADEMY,
    SUBDOMAINS.PROVIDER,
    SUBDOMAINS.UMP,
    SUBDOMAINS.WALLET,
    SUBDOMAINS.MYACCOUNT,
  ],
  admin: [
    SUBDOMAINS.AUTH,
    SUBDOMAINS.API,
    SUBDOMAINS.UMP,
    SUBDOMAINS.MYACCOUNT,
    SUBDOMAINS.WALLET,
    SUBDOMAINS.ACADEMY,
  ],
  staff: [
    SUBDOMAINS.AUTH,
    SUBDOMAINS.ACADEMY,
    SUBDOMAINS.MYACCOUNT,
    SUBDOMAINS.WALLET,
  ],
  center: [SUBDOMAINS.AUTH, SUBDOMAINS.ACADEMY, SUBDOMAINS.MYACCOUNT],
  provider: [
    SUBDOMAINS.AUTH,
    SUBDOMAINS.PROVIDER,
    SUBDOMAINS.MYACCOUNT,
    SUBDOMAINS.WALLET,
  ],
  student: [SUBDOMAINS.AUTH, SUBDOMAINS.ACADEMY, SUBDOMAINS.MYACCOUNT],
  user: [SUBDOMAINS.AUTH, SUBDOMAINS.MYACCOUNT],
};

// ==========================================
// 4. UTILITY FUNCTIONS (For Middleware)
// ==========================================

export const config = {
  /**
   * Check if a subdomain is public
   */
  isPublic: (subdomain: string) => {
    return PUBLIC_SUBDOMAINS.includes(subdomain as Subdomain);
  },

  /**
   * Check if a specific role has access to a subdomain
   */
  hasAccess: (role: UserRole, subdomain: string) => {
    const allowed = SUBDOMAIN_ACCESS_BY_ROLE[role];
    return allowed ? allowed.includes(subdomain as Subdomain) : false;
  },

  /**
   * Get the default redirect subdomain for a role (e.g. after login)
   */
  getDefaultRoute: (role: UserRole): Subdomain => {
    if (role === "super-admin") return SUBDOMAINS.GOD;
    if (role === "provider") return SUBDOMAINS.PROVIDER;
    return SUBDOMAINS.MYACCOUNT;
  },
};

export const SUBDOMAIN_CONFIG = {
  APP: PROTECTED_SUBDOMAINS,
  PUBLIC: PUBLIC_SUBDOMAINS,
  TYPES: SUBDOMAINS,
};
