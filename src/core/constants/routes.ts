/**
 * Routes Constants
 * Application routing paths organized by subdomain
 */

// ==========================================
// ROOT DOMAIN ROUTES
// ==========================================

export const ROOT_ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    FAQ: '/faq',
} as const;

// ==========================================
// AUTH SUBDOMAIN ROUTES
// ==========================================

export const AUTH_ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    LOGOUT: '/logout',
} as const;

// ==========================================
// GOD PANEL ROUTES (Super Admin)
// ==========================================

export const GOD_ROUTES = {
    DASHBOARD: '/',
    USERS: '/users',
    ANALYTICS: '/analytics',
    SETTINGS: '/settings',
    SYSTEM: '/system',
    LOGS: '/logs',
    PERMISSIONS: '/permissions',
} as const;

// ==========================================
// UMP ROUTES (User Management Portal)
// ==========================================

export const UMP_ROUTES = {
    DASHBOARD: '/',
    USERS: '/users',
    ROLES: '/roles',
    ACTIVITY: '/activity',
    REPORTS: '/reports',
    SETTINGS: '/settings',
} as const;

// ==========================================
// MY ACCOUNT ROUTES
// ==========================================

export const MYACCOUNT_ROUTES = {
    DASHBOARD: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    CHANGE_PASSWORD: '/change-password',
    WALLET: '/wallet',
    WALLET_RECHARGE: '/wallet/recharge',
    WALLET_TRANSACTIONS: '/wallet/transactions',
    NOTIFICATIONS: '/notifications',
    DOWNLOADS: '/downloads',
    SUPPORT: '/support',
} as const;

// ==========================================
// API ROUTES
// ==========================================

export const API_ROUTES = {
    // Auth
    AUTH_LOGIN: '/auth/login',
    AUTH_SIGNUP: '/auth/signup',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_REFRESH: '/auth/refresh',

    // Users
    USERS: '/users',
    USER_BY_ID: '/users/:id',

    // Statistics
    STATS: '/stats',
    STATS_DASHBOARD: '/stats/dashboard',
} as const;

// ==========================================
// ROUTE HELPERS
// ==========================================

/**
 * Get route with parameters replaced
 * @param route - Route template
 * @param params - Parameters to replace
 * @returns Route with parameters
 */
export function getRoute(route: string, params: Record<string, string>): string {
    let result = route;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, value);
    });
    return result;
}

/**
 * Build query string from params
 * @param params - Query parameters
 * @returns Query string
 */
export function buildQueryString(params: Record<string, unknown>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value));
        }
    });
    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
}

// ==========================================
// ALL ROUTES EXPORT
// ==========================================

export const ROUTES = {
    ROOT: ROOT_ROUTES,
    AUTH: AUTH_ROUTES,
    GOD: GOD_ROUTES,
    UMP: UMP_ROUTES,
    MYACCOUNT: MYACCOUNT_ROUTES,
    API: API_ROUTES,
} as const;
