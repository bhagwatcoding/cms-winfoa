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
export type { IUser } from "./core/User";

export { default as Session } from "./core/Session";
export type { ISession } from "./core/Session";

export { default as Role } from "./core/Role";
export type { IRole } from "./core/Role";

export { default as ActivityLog } from "./core/ActivityLog";
export type { IActivityLog } from "./core/ActivityLog";

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
export type { IUserRegistry } from "./admin/UserRegistry";

// ==========================================
// ACADEMY MODELS (Skills/Education subdomain)
// ==========================================

export { default as Course } from "./academy/Course";
export type { ICourse } from "./academy/Course";

export { default as Student } from "./academy/Student";
export type { IStudent } from "./academy/Student";

export { default as Certificate } from "./academy/Certificate";
export type { ICertificate } from "./academy/Certificate";

export { default as Result } from "./academy/Result";
export type { IResult } from "./academy/Result";

export { default as AdmitCard } from "./academy/AdmitCard";
export type { IAdmitCard } from "./academy/AdmitCard";

export { default as Employee } from "./academy/Employee";
export type { IEmployee } from "./academy/Employee";

export { default as Center } from "./academy/Center";
export type { ICenter } from "./academy/Center";

export { default as Enrollment } from "./academy/Enrollment";
export type { IEnrollment } from "./academy/Enrollment";

export { default as Transaction } from "./academy/Transaction";
export type { ITransaction } from "./academy/Transaction";

export { default as Notification } from "./academy/Notification";
export type { INotification } from "./academy/Notification";

export { default as PasswordResetToken } from "./academy/PasswordResetToken";
export type { IPasswordResetToken } from "./academy/PasswordResetToken";

// ==========================================
// WALLET MODELS
// ==========================================

export { default as WalletTransaction } from "./wallet/WalletTransaction";
export type { IWalletTransaction } from "./wallet/WalletTransaction";
