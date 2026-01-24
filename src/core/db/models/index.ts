// 🌐 GLOBAL MODELS - Complete Professional Structure
// All database models organized by subdomain

/**
 * Professional Organization:
 * - core/     → Core entities (User, Session, PasswordReset, Notification)
 * - account/  → Account management (Preferences, Activity, Transaction)
 * - api/      → API management (ApiKey, ApiRequest)
 * - admin/    → Admin/UMP (UserRegistry)
 * - skills/   → Skills/Education (Course, Student, Certificate, Result, etc.)
 *
 * Usage:
 * import { User, Course, ApiKey } from '@/models'
 */

// ==========================================
// CORE MODELS (User, Session, Auth)
// ==========================================

export { default as User } from "./core/User";
export type { IUser } from "@/shared/types/models"; // Re-export from central types

export { default as Session } from "./core/Session";
export type { ISession } from "./core/Session";

export { default as Role } from "./core/Role";
export type { IRole } from "./core/Role";

export { default as ActivityLog } from "./core/ActivityLog";
export type { IActivityLog } from "./core/ActivityLog";

export { default as ApiKey } from "./core/ApiKey";
export type { IApiKey } from "./core/ApiKey";

export { default as ApiRequest } from "./core/ApiRequest";
export type { IApiRequest } from "./core/ApiRequest";

export { default as PasswordResetToken } from "./core/PasswordReset";

export { default as Notification } from "./core/Notification";

// ==========================================
// ACCOUNT MODELS (MyAccount subdomain)
// ==========================================

export { default as UserPreferences } from "./account/UserPreferences";
export type { IUserPreferences } from "./account/UserPreferences";

// export { default as ActivityLog } from "./account/ActivityLog";
// export type { IActivityLog } from "./account/ActivityLog";

// ==========================================
// ADMIN MODELS (UMP subdomain)
// ==========================================

export { default as UserRegistry } from "./admin/UserRegistry";
export type { IUserRegistry } from "@/types";

// ==========================================
// WALLET MODELS
// ==========================================

export { default as WalletTransaction } from "./wallet/WalletTransaction";
export { default as Transaction } from "./wallet/WalletTransaction"; // Alias for backward compatibility
export type { IWalletTransaction } from "@/types";

