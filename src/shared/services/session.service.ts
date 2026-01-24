/**
 * Session Service
 * Re-exports from core auth for backward compatibility
 */

export {
    createSession,
    getSession,
    login,
    logout,
    requireAuth,
    requireRole,
    getCurrentUser,
    setSessionCookie,
} from '@/core/auth';

// Aliases for backward compatibility
export const SessionService = {
    async getCurrentUser() {
        const { getSession } = await import('@/core/auth');
        const { user } = await getSession();
        return user;
    },
    async getSession() {
        const { getSession } = await import('@/core/auth');
        return getSession();
    },
    async createSession(userId: string, userAgent?: string, ipAddress?: string) {
        const { createSession } = await import('@/core/auth');
        return createSession(userId, userAgent, ipAddress);
    },
    async destroySession() {
        const { logout } = await import('@/core/auth');
        return logout();
    }
};

export default SessionService;
