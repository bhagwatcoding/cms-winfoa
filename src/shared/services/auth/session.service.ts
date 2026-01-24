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
