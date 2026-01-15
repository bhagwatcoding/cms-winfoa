// Authentication System Barrel Export
// This file provides a centralized export for all authentication utilities

// Session management
export {
    createSession,
    getSession,
    getCurrentUser,
    setSessionCookie,
    deleteSessionCookie,
    destroySession,
    destroyAllUserSessions,
    extendSession,
    getUserSessions,
    cleanupExpiredSessions,
    isValidSessionToken,
    hasSubdomainAccess,
    requireAuth,
    requireRole,
    SESSION_CONFIG,
} from './session';

// Type exports
export type {
    SessionUser,
    SessionData,
} from './session';

// Database models (re-export for convenience)
export * from "@/lib/db";
export { User, Session } from '@/lib/db/models';
export type { IUser, ISession } from '@/lib/db/models';

// Authentication helpers
export const AUTH_CONSTANTS = {
    COOKIE_NAME: 'winfoa_session',
    MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
    BCRYPT_ROUNDS: 12,
};

// Role-based permissions (simplified)
export const ROLE_PERMISSIONS: Record<string, string[]> = {
    'admin': ['*'], // Admin has all permissions
    'staff': [
        'students:view', 'students:create', 'students:update',
        'courses:view', 'courses:create', 'courses:update',
        'certificates:view', 'certificates:create',
    ],
    'student': [
        'profile:view', 'profile:update',
        'courses:view',
        'certificates:view',
    ],
    'user': [
        'profile:view', 'profile:update',
    ],
};

// Simplified subdomain access by role
export const ROLE_SUBDOMAIN_ACCESS: Record<string, string[]> = {
    'admin': ['auth', 'academy', 'myaccount', 'wallet'],
    'staff': ['auth', 'academy', 'myaccount'],
    'student': ['auth', 'academy', 'myaccount'],
    'user': ['auth', 'myaccount'],
};

// Utility function to check if user has permission
export function hasPermission(userRole: string, permission: string, customPermissions?: string[]): boolean {
    // Admin has all permissions
    if (userRole === 'admin') return true;

    // Check custom permissions first
    if (customPermissions?.includes(permission)) return true;

    // Check role-based permissions
    const rolePerms = ROLE_PERMISSIONS[userRole] || [];
    return rolePerms.includes(permission) || rolePerms.includes('*');
}

// Utility function to get user's subdomain access
export function getUserSubdomainAccess(userRole: string, customAccess?: string[]): string[] {
    if (customAccess && customAccess.length > 0) {
        return customAccess;
    }

    return ROLE_SUBDOMAIN_ACCESS[userRole] || ['auth', 'myaccount'];
}

// Simplified password validation (user-friendly)
export const PASSWORD_REQUIREMENTS = {
    minLength: 6,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
};

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
    }

    if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
        errors.push(`Password must be less than ${PASSWORD_REQUIREMENTS.maxLength} characters long`);
    }

    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Email validation
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// User role validation
export function isValidUserRole(role: string): boolean {
    return Object.keys(ROLE_PERMISSIONS).includes(role);
}

// Helper to generate secure tokens
export function generateSecureToken(length: number = 32): string {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
}
