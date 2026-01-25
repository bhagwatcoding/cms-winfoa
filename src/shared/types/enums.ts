/**
 * Shared Enums
 * Compatibility layer re-exporting from Core sources.
 *
 * @deprecated Prefer importing directly from @/core/types/enums or @/core/db/enums
 */

// Core Types (Primary Source for Types)
export * from '@/core/types/enums';

// DB Enums (Source for Database-centric Enums)
export {
  ResourceType,
  ResourceTypeLabel,
  AuditSeverity,
  AuditSeverityLabel,
  AuditCategory,
  AuditCategoryLabel,
  LoginAttemptResult,
  LoginAttemptResultLabel,
  OAuthProvider,
  OAuthProviderLabel,
  ApiKeyScope,
  ApiKeyScopeLabel,
  NotificationType,
  NotificationTypeLabel,
  NotificationPriority,
  NotificationPriorityLabel,
  NotificationChannel,
  NotificationChannelLabel,
} from '@/core/db/enums';

// Aliases for backward compatibility with older shared code
import {
  DeviceType,
  DeviceTypeLabels,
  LoginMethodLabels,
  RiskLevelLabels,
  SessionStatusLabels,
  UserRoleLabels,
  UserStatusLabels,
} from '@/core/types/enums';

export const DeviceTypeLabel = DeviceTypeLabels;
export const LoginMethodLabel = LoginMethodLabels;
export const RiskLevelLabel = RiskLevelLabels;
export const SessionStatusLabel = SessionStatusLabels;
export const UserRoleLabel = UserRoleLabels;
export const UserStatusLabel = UserStatusLabels;

// HELPER Aliases - Forwarding to the central helper
import { EnumHelper, getLabelFromEnum, getEnumValues } from '@/core/helpers/enum.helper';
export { EnumHelper, getLabelFromEnum, getEnumValues };

// Compatibility wrappers for common shared functions
export const getDeviceLabel = (val: DeviceType) => EnumHelper.labelFrom(DeviceTypeLabels, val);
export const isValidDeviceType = (val: DeviceType) =>
  EnumHelper.numericValues(DeviceTypeLabels).includes(val);
