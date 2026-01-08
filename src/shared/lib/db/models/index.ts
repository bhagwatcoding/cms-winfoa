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

export { default as User } from './core/User'
export type { IUser } from './core/User'

export { default as Session } from './core/Session'
export type { ISession } from './core/Session'

export { Role } from './core/Role'
export type { IRole } from './core/Role'

// ==========================================
// ACCOUNT MODELS (MyAccount subdomain)
// ==========================================

export { default as UserPreferences } from './account/UserPreferences'
export type { IUserPreferences } from './account/UserPreferences'

export { default as ActivityLog } from './account/ActivityLog'
export type { IActivityLog } from './account/ActivityLog'

// ==========================================
// API MODELS (API Management subdomain)
// ==========================================

export { default as ApiKey } from './api/ApiKey'
export type { IApiKey } from './api/ApiKey'

export { default as ApiRequest } from './api/ApiRequest'
export type { IApiRequest } from './api/ApiRequest'

// ==========================================
// ADMIN MODELS (UMP subdomain)
// ==========================================

export { default as UserRegistry } from './admin/UserRegistry'
export type { IUserRegistry } from './admin/UserRegistry'

// ==========================================
// SKILLS MODELS (Skills/Education subdomain)
// ==========================================

export { default as Course } from './skills/Course'
export type { ICourse } from './skills/Course'

export { default as Student } from './skills/Student'
export type { IStudent } from './skills/Student'

export { default as Certificate } from './skills/Certificate'
export type { ICertificate } from './skills/Certificate'

export { default as Result } from './skills/Result'
export type { IResult } from './skills/Result'

export { default as AdmitCard } from './skills/AdmitCard'
export type { IAdmitCard } from './skills/AdmitCard'

export { default as Employee } from './skills/Employee'
export type { IEmployee } from './skills/Employee'

export { default as Center } from './skills/Center'
export type { ICenter } from './skills/Center'

export { default as Transaction } from './skills/Transaction'
export type { ITransaction } from './skills/Transaction'

export { default as Notification } from './skills/Notification'
export type { INotification } from './skills/Notification'

export { default as PasswordResetToken } from './skills/PasswordResetToken'
export type { IPasswordResetToken } from './skills/PasswordResetToken'

// ==========================================
// WALLET MODELS
// ==========================================

export { default as WalletTransaction } from './wallet/WalletTransaction'
export type { IWalletTransaction } from './wallet/WalletTransaction'

