/**
 * Database Models - Central Export
 * All database models organized by subdomain
 *
 * Structure:
 * - interfaces/ → TypeScript interfaces and enums
 * - schemas/    → Mongoose schema definitions
 * - models/     → Final model exports (this folder)
 *
 * Usage:
 * import { User, Role, Wallet } from '@/core/db/models'
 */

// ==========================================
// CORE MODELS (User, Session, Auth)
// ==========================================

export { default as User } from './core/User';
export type { IUser } from '@/core/db/interfaces';

export { default as Session } from './core/Session';
export type { ISession } from '@/core/db/interfaces';

export { default as Role } from './core/Role';
export type { IRole } from './core/Role';

export { default as ActivityLog } from './core/ActivityLog';
export type { IActivityLog } from './core/ActivityLog';
export { ResourceType } from './core/ActivityLog';

export { default as ApiKey } from './core/ApiKey';
export type { IApiKey } from './core/ApiKey';
export { ApiKeyScope, ApiKeyEnvironment } from './core/ApiKey';

export { default as ApiRequest } from './core/ApiRequest';
export type { IApiRequest } from './core/ApiRequest';

export { default as PasswordResetToken } from './core/PasswordReset';

export { default as Notification } from './core/Notification';
export type { INotification } from './core/Notification';
export { NotificationType, NotificationPriority, NotificationChannel } from './core/Notification';

export { default as AuditLog } from './core/AuditLog';
export { default as LoginAttempt } from './core/LoginAttempt';
export { default as Permission } from './core/Permission';
export { default as RateLimitRecord } from './core/RateLimitRecord';
export { default as SystemSetting } from './core/SystemSetting';
export { default as WebhookSubscription } from './core/WebhookSubscription';
export { default as EmailVerification } from './core/EmailVerification';

// ==========================================
// ACCOUNT MODELS (MyAccount subdomain)
// ==========================================

export { default as UserPreferences } from './account/UserPreferences';
export type { IUserPreferences } from './account/UserPreferences';

// ==========================================
// ADMIN MODELS (UMP subdomain)
// ==========================================

export { default as UserRegistry } from './admin/UserRegistry';
export type { IUserRegistry } from './admin/UserRegistry';

// ==========================================
// WALLET MODELS
// ==========================================

export { default as Wallet } from './wallet/Wallet';
export type { IWallet } from './wallet/Wallet';

export { default as WalletTransaction } from './wallet/WalletTransaction';
export { default as Transaction } from './wallet/WalletTransaction'; // Alias
export type { IWalletTransaction } from './wallet/WalletTransaction';
