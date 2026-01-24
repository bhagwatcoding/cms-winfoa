/**
 * Model Types - Central Export
 * All database model interfaces organized and exported
 */

// ==========================================
// CORE MODEL TYPES
// ==========================================

export type {
  IUser,
  ISoftDelete,
  ILoginHistory,
  ILinkedAccount,
  IUserProfile,
  ITwoFactorSettings,
  ISession,
  IUserPreferences,
  IActivityLog,
  IApiKey,
  IApiRequest,
  IUserRegistry,
  UserRole,
  UserStatus,
  OAuthProvider,
  ThemeMode,
  NotificationSettings,
  IDeviceInfo,
  IGeoInfo,
  ISessionResult,
  ISecurityInfo,
  IClientMeta,
} from "./core.interface";

// ==========================================
// WALLET MODEL TYPES
// ==========================================

export type { IWalletTransaction } from "./wallet.interface";
