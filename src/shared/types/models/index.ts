/**
 * Model Types - Central Export
 * All database model interfaces organized and exported
 */

// ==========================================
// CORE MODEL TYPES
// ==========================================

export type {
  IUser,
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
} from "./core.interface";

// ==========================================
// ACADEMY MODEL TYPES
// ==========================================

export type {
  IStudent,
  ICourse,
  ICertificate,
  IResult,
  IAdmitCard,
  IEmployee,
  ICenter,
  ITransaction,
  INotification,
  IPasswordResetToken,
  Gender,
  StudentStatus,
  CourseLevel,
  CertificateStatus,
  ResultStatus,
  AdmitCardStatus,
  EmployeeStatus,
  TransactionType,
  TransactionStatus,
  NotificationType,
} from "./academy.interface";

// ==========================================
// WALLET MODEL TYPES
// ==========================================

export type { IWalletTransaction } from "./wallet.interface";
