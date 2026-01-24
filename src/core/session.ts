/**
 * Session Management - Re-export from core auth
 * This module exists for backward compatibility
 * @module CoreSession
 */

// Re-export all session-related functions from auth module
export {
    createSession,
    getSession,
    login,
    logout,
    requireAuth,
    requireRole,
    getCurrentUser,
    setSessionCookie,
    hashPassword,
    verifyPassword
} from './auth';
