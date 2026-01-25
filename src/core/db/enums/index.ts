/**
 * Database Enums - Central Export
 * Re-exports all enums needed for database models
 * All enums use numeric values for efficient DB storage
 */

// ==========================================
// CORE SYSTEM ENUMS (from core types)
// ==========================================

export {
  // Device & Session
  DeviceType,
  DeviceTypeLabels,
  LoginMethod,
  LoginMethodLabels,
  RiskLevel,
  RiskLevelLabels,
  SessionStatus,
  SessionStatusLabels,
  // User & Auth
  UserRole,
  UserRoleLabels,
  UserStatus,
  UserStatusLabels,
  // Transaction
  TransactionType,
  TransactionTypeLabel, // Re-adding assuming it exists or fixing if not
  TransactionStatus,
  // Action
  ActionType,
  ActionTypeLabel,
} from '@/core/types/enums';

// ==========================================
// DB-SPECIFIC ENUMS (from separate files)
// ==========================================

// API Key
export {
  ApiKeyScope,
  ApiKeyScopeLabel,
  ApiKeyEnvironment,
  ApiKeyEnvironmentLabel,
} from './apikey.enum';

// Notification
export {
  NotificationType,
  NotificationTypeLabel,
  NotificationPriority,
  NotificationPriorityLabel,
  NotificationChannel,
  NotificationChannelLabel,
} from './notification.enum';

// Audit & Activity
export {
  ResourceType,
  ResourceTypeLabel,
  AuditSeverity,
  AuditSeverityLabel,
  AuditCategory,
  AuditCategoryLabel,
} from './audit.enum';

// Auth & Login
export {
  LoginAttemptResult,
  LoginAttemptResultLabel,
  OAuthProvider,
  OAuthProviderLabel,
} from './auth.enum';

// Preferences
export {
  ThemeMode,
  ThemeModeLabel,
  ProfileVisibility,
  ProfileVisibilityLabel,
  Gender,
  GenderLabels,
} from './preference.enum';

// Settings
export {
  SettingType,
  SettingTypeLabel,
  SettingCategory,
  SettingCategoryLabel,
  RateLimitType,
  RateLimitTypeLabel,
} from './setting.enum';

// Permission
export { PermissionAction, PermissionActionLabel } from './permission.enum';

// Webhook
export { WebhookEvent, WebhookEventLabel, WebhookStatus, WebhookStatusLabel } from './webhook.enum';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export {
  getLabelFromEnum,
  getEnumValues,
  getNumericEnumValues,
  getEnumRange,
  EnumHelper,
} from '@/core/helpers/enum.helper';
