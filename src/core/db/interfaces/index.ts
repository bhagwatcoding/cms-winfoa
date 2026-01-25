/**
 * Database Interfaces - Central Export
 * All database model interfaces organized and exported
 */

// ==========================================
// CORE MODEL TYPES
// ==========================================

export type {
  // User & Auth
  IUser,
  ISoftDelete,
  ILoginHistory,
  ILinkedAccount,
  IUserProfile,
  IUserPreferences,
  ITwoFactorSettings,
  // Session
  ISession,
  ISessionResult,
  IDeviceInfo,
  IGeoInfo,
  ISecurityInfo,
  IClientMeta,
  // API
  IApiRequest,
  // Other
  IActivityLog as IActivityLogCore,
  IUserRegistry as IUserRegistryCore,
  NotificationSettings,
} from './core.interface';

// ==========================================
// API KEY TYPES
// ==========================================

export type { IApiKey } from './apikey.interface';
export { ApiKeyScope, ApiKeyEnvironment } from './apikey.interface';

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export type { INotification } from './notification.interface';
export {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from './notification.interface';

// ==========================================
// ACTIVITY LOG TYPES
// ==========================================

export type { IActivityLog } from './activitylog.interface';
export { ResourceType } from './activitylog.interface';

// ==========================================
// AUDIT LOG TYPES
// ==========================================

export type { IAuditLog, IAuditActor, IAuditTarget, IAuditContext } from './auditlog.interface';
export { AuditSeverity, AuditCategory } from './auditlog.interface';

// ==========================================
// LOGIN ATTEMPT TYPES
// ==========================================

export type { ILoginAttempt } from './loginattempt.interface';
export { LoginAttemptResult } from './loginattempt.interface';

// ==========================================
// USER PREFERENCES TYPES
// ==========================================

export type {
  IUserPreferencesDoc,
  IEmailNotificationPrefs,
  IPushNotificationPrefs,
  IPrivacyPrefs,
} from './userpreferences.interface';

// ==========================================
// USER REGISTRY TYPES
// ==========================================

export type { IUserRegistry } from './userregistry.interface';

// ==========================================
// WALLET TYPES
// ==========================================

export type { IWallet, IWalletTransaction } from './wallet.interface';

// ==========================================
// ROLE TYPES
// ==========================================

export type { IRole } from './role.interface';

// ==========================================
// SESSION TYPES (FROM SEPARATE FILE)
// ==========================================

export type {
  IDeviceInfo as IDeviceInfoSession,
  ISessionResult as ISessionResultClean,
} from './session.interface';

// ==========================================
// DB ENUMS (RE-EXPORT FOR CONVENIENCE)
// ==========================================

export {
  // Core system enums
  DeviceType,
  LoginMethod,
  RiskLevel,
  SessionStatus,
  UserRole,
  UserStatus,
  // Transaction enums
  TransactionType,
  TransactionTypeLabel,
  TransactionStatus,
  // Action enums
  ActionType,
  ActionTypeLabel,
  // Theme
  ThemeMode,
  ThemeModeLabel,
  ProfileVisibility,
  ProfileVisibilityLabel,
  // OAuth
  OAuthProvider,
  OAuthProviderLabel,
  // Setting enums
  SettingType,
  SettingTypeLabel,
  SettingCategory,
  SettingCategoryLabel,
  // Rate limit
  RateLimitType,
  RateLimitTypeLabel,
  // Permission
  PermissionAction,
  PermissionActionLabel,
  // Webhook
  WebhookEvent,
  WebhookEventLabel,
  WebhookStatus,
  WebhookStatusLabel,
  // Helpers
  getLabelFromEnum,
  getEnumValues,
  getEnumRange,
} from '@/core/db/enums';
