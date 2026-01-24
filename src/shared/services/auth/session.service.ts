/**
 * Auth Session Service
 * Session management for authentication
 */

export {
    getSession,
    getCurrentUser,
    createSession,
    logout as destroySession
} from '@/core/auth';

// Re-export SessionCoreService as SessionService for backward compatibility
export { SessionCoreService as SessionService } from '@/shared/services/session';
