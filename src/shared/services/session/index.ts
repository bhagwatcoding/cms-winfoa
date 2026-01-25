/**
 * Session Services Index
 * Centralized exports for all session-related services
 * Organized by functionality and domain
 */

// ===== MAIN SESSION SERVICE =====
export { SessionCoreService as SessionService } from './core.service';

// ===== SPECIALIZED SERVICE MODULES =====
export { SessionCoreService } from './core.service';
export { SessionSecurityService } from './security.service';
export { SessionAnalyticsService } from './analytics.service';
export { SessionManagementService } from './management.service';

// ===== TYPES AND INTERFACES =====
export type {
  SessionStats,
  DeviceAnalytics,
  LocationAnalytics,
  SecurityAnalytics,
  SessionDashboard,
} from './types';

// ===== UTILITY FUNCTIONS =====
export {
  generateSessionToken,
  validateSessionDuration,
  isSessionExpired,
  formatSessionData,
} from './utils';
