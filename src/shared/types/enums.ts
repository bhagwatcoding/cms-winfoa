/**
 * Enterprise-Grade Enum Definitions
 * Comprehensive type-safe enumeration system for the entire application
 * 
 * @module Enums
 * @description Centralized enum definitions with utility functions, type guards, and validation helpers
 * @author Your Team
 * @version 2.0.0
 * 
 * @example
 * ```typescript
 * import { DEVICE_TYPE, getDeviceLabel, isValidDeviceType } from '@/types/enums';
 * 
 * // Basic usage
 * const deviceType = DEVICE_TYPE.MOBILE;
 * const label = getDeviceLabel(deviceType); // "Mobile"
 * 
 * // Type guards
 * if (isValidDeviceType(someValue)) {
 *   // TypeScript knows someValue is DEVICE_TYPE
 * }
 * ```
 */

// =============================================================================
// SECTION 1: CORE SYSTEM ENUMS - Authentication & Security
// =============================================================================

/**
 * Device type enumeration for comprehensive device detection
 * Supports modern device categories including IoT and wearable devices
 */
export enum DeviceType {
  Unknown = 1,
  Desktop = 2,
  Tablet = 3,
  Mobile = 4,
  Tv = 5,
  Bot = 6,
  Wearable = 7,
}

/**
 * Comprehensive login method enumeration
 * Supports traditional and modern authentication methods
 */
export enum LoginMethod {
  Password = 1,
  Google = 2,
  Github = 3,
  MagicLink = 4,
  Passkey = 5,
  MfaTotp = 6,
  MfaSms = 7,
  RecoveryCode = 8,
}

/**
 * Security risk level enumeration for threat assessment
 * Used in session security and fraud detection systems
 */
export enum RiskLevel {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

/**
 * Session status enumeration for comprehensive session lifecycle management
 */
export enum SessionStatus {
  Active = 1,
  Expired = 2,
  Revoked = 3,
  LoggedOut = 4,
  Locked = 5,
  Impersonated = 6,
}

// =============================================================================
// SECTION 2: SYSTEM ACTION ENUMS - Audit & Activity Tracking
// =============================================================================

/**
 * Comprehensive action type enumeration for audit logging
 * Covers all CRUD operations and security-relevant actions
 */
export enum ActionType {
  Create = 1,
  Update = 2,
  SoftDelete = 3,
  HardDelete = 4,
  Restore = 5,
  Login = 6,
  LoginFailed = 7,
  Logout = 8,
  ExportData = 9,
  PermissionChange = 10,
  ApiKeyGenerate = 11,
}

/**
 * Resource type enumeration for access control and audit logging
 */
export enum ResourceType {
  User = 1,
  Session = 2,
  Role = 3,
  Order = 4,
  Subscription = 5,
  File = 6,
  SystemConfig = 7,
}

// =============================================================================
// SECTION 3: FINANCIAL ENUMS - Wallet & Transaction Management
// =============================================================================

/**
 * Transaction type enumeration for comprehensive financial operations
 * Supports all modern payment and transaction scenarios
 */
export enum TransactionType {
  Credit = 1,
  Debit = 2,
  Transfer = 3,
  Recharge = 4,
  Withdrawal = 5,
  Refund = 6,
  Fee = 7,
  Commission = 8,
}

/**
 * Transaction status enumeration for complete transaction lifecycle
 */
export enum TransactionStatus {
  Pending = 1,
  Processing = 2,
  Completed = 3,
  Failed = 4,
  Cancelled = 5,
  Refunded = 6,
}

// =============================================================================
// SECTION 4: NOTIFICATION ENUMS - Multi-channel Communication
// =============================================================================

/**
 * Notification type enumeration for different notification categories
 */
export enum NotificationType {
  Info = 1,
  Success = 2,
  Warning = 3,
  Error = 4,
  System = 5,
}

/**
 * Communication channel enumeration for multi-channel notifications
 */
export enum NotificationChannel {
  Email = 1,
  Push = 2,
  Sms = 3,
  InApp = 4,
}

/**
 * Notification status enumeration for delivery tracking
 */
export enum NotificationStatus {
  Unread = 1,
  Read = 2,
  Archived = 3,
}

// =============================================================================
// SECTION 5: USER MANAGEMENT ENUMS - Role & Status Management
// =============================================================================

/**
 * User role enumeration for role-based access control (RBAC)
 */
export enum UserRole {
  God = 1,
  SuperAdmin = 2,
  User = 3,
}

/**
 * User status enumeration for account lifecycle management
 */
export enum UserStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Pending = 4,
}

// =============================================================================
// SECTION 6: LABEL MAPPINGS - Human-readable Descriptions
// =============================================================================

/**
 * Device type labels for UI display
 */
export const DeviceTypeLabel = {
  [DeviceType.Unknown]: "Unknown Device",
  [DeviceType.Desktop]: "Desktop Computer",
  [DeviceType.Tablet]: "Tablet Device",
  [DeviceType.Mobile]: "Mobile Phone",
  [DeviceType.Tv]: "Smart TV",
  [DeviceType.Bot]: "Bot/Crawler",
  [DeviceType.Wearable]: "Wearable Device",
} as const;

/**
 * Login method labels for UI display
 */
export const LoginMethodLabel = {
  [LoginMethod.Password]: "Password Authentication",
  [LoginMethod.Google]: "Google OAuth",
  [LoginMethod.Github]: "GitHub OAuth",
  [LoginMethod.MagicLink]: "Magic Link",
  [LoginMethod.Passkey]: "Biometric Authentication",
  [LoginMethod.MfaTotp]: "Authenticator App",
  [LoginMethod.MfaSms]: "SMS Verification",
  [LoginMethod.RecoveryCode]: "Recovery Code",
} as const;

/**
 * Login method labels for UI display
 */
export type LoginMethodLabel = typeof LoginMethodLabel[keyof typeof LoginMethodLabel];

/**
 * Risk level labels for security UI
 */
export const RiskLevelLabel = {
  [RiskLevel.Low]: "Low Risk",
  [RiskLevel.Medium]: "Medium Risk",
  [RiskLevel.High]: "High Risk",
  [RiskLevel.Critical]: "Critical Risk",
} as const;

/**
 * Session status labels for UI display
 */
export const SessionStatusLabel = {
  [SessionStatus.Active]: "Active Session",
  [SessionStatus.Expired]: "Expired Session",
  [SessionStatus.Revoked]: "Revoked Session",
  [SessionStatus.LoggedOut]: "Logged Out",
  [SessionStatus.Locked]: "Security Lock",
  [SessionStatus.Impersonated]: "Admin Session",
} as const;

/**
 * Action type labels for audit logs
 */
export const ActionTypeLabel = {
  [ActionType.Create]: "Create Resource",
  [ActionType.Update]: "Update Resource",
  [ActionType.SoftDelete]: "Soft Delete",
  [ActionType.HardDelete]: "Permanent Delete",
  [ActionType.Restore]: "Restore Resource",
  [ActionType.Login]: "User Login",
  [ActionType.LoginFailed]: "Failed Login",
  [ActionType.Logout]: "User Logout",
  [ActionType.ExportData]: "Data Export",
  [ActionType.PermissionChange]: "Permission Change",
  [ActionType.ApiKeyGenerate]: "API Key Generated",
} as const;

/**
 * Resource type labels for access control
 */
export const ResourceTypeLabel = {
  [ResourceType.User]: "User Account",
  [ResourceType.Session]: "User Session",
  [ResourceType.Role]: "System Role",
  [ResourceType.Order]: "Order/Transaction",
  [ResourceType.Subscription]: "Subscription",
  [ResourceType.File]: "File/Document",
  [ResourceType.SystemConfig]: "System Configuration",
} as const;

/**
 * Transaction type labels for financial UI
 */
export const TransactionTypeLabel = {
  [TransactionType.Credit]: "Credit",
  [TransactionType.Debit]: "Debit",
  [TransactionType.Transfer]: "Transfer",
  [TransactionType.Recharge]: "Recharge",
  [TransactionType.Withdrawal]: "Withdrawal",
  [TransactionType.Refund]: "Refund",
  [TransactionType.Fee]: "Processing Fee",
  [TransactionType.Commission]: "Commission",
} as const;

/**
 * Transaction status labels for UI display
 */
export const TransactionStatusLabel = {
  [TransactionStatus.Pending]: "Pending",
  [TransactionStatus.Processing]: "Processing",
  [TransactionStatus.Completed]: "Completed",
  [TransactionStatus.Failed]: "Failed",
  [TransactionStatus.Cancelled]: "Cancelled",
  [TransactionStatus.Refunded]: "Refunded",
} as const;

/**
 * Notification type labels for UI categorization
 */
export const NotificationTypeLabel = {
  [NotificationType.Info]: "Information",
  [NotificationType.Success]: "Success",
  [NotificationType.Warning]: "Warning",
  [NotificationType.Error]: "Error",
  [NotificationType.System]: "System",
} as const;

/**
 * Notification channel labels for preference management
 */
export const NotificationChannelLabel = {
  [NotificationChannel.Email]: "Email",
  [NotificationChannel.Push]: "Push Notification",
  [NotificationChannel.Sms]: "SMS",
  [NotificationChannel.InApp]: "In-App",
} as const;

/**
 * Notification status labels for delivery tracking
 */
export const NotificationStatusLabel = {
  [NotificationStatus.Unread]: "Unread",
  [NotificationStatus.Read]: "Read",
  [NotificationStatus.Archived]: "Archived",
} as const;

/**
 * User role labels for access control UI
 */
export const UserRoleLabel = {
  [UserRole.God]: "System Administrator",
  [UserRole.SuperAdmin]: "Super Administrator",
  [UserRole.User]: "Standard User",
} as const;

/**
 * User status labels for account management
 */
export const UserStatusLabel = {
  [UserStatus.Active]: "Active",
  [UserStatus.Inactive]: "Inactive",
  [UserStatus.Suspended]: "Suspended",
  [UserStatus.Pending]: "Pending Activation",
} as const;

// =============================================================================
// SECTION 7: MASTER LABEL COLLECTION - Convenience Export
// =============================================================================

/**
 * Master collection of all enum labels for easy access
 */
export const LABEL = {
  DeviceType: DeviceTypeLabel,
  LoginMethod: LoginMethodLabel,
  RiskLevel: RiskLevelLabel,
  SessionStatus: SessionStatusLabel,
  ActionType: ActionTypeLabel,
  ResourceType: ResourceTypeLabel,
  TransactionType: TransactionTypeLabel,
  TransactionStatus: TransactionStatusLabel,
  NotificationType: NotificationTypeLabel,
  NotificationChannel: NotificationChannelLabel,  
  NotificationStatus: NotificationStatusLabel,
  UserRole: UserRoleLabel,
  UserStatus: UserStatusLabel,
} as const;

// =============================================================================
// SECTION 8: TYPE UTILITY FUNCTIONS - Type Safety & Validation
// =============================================================================

/**
 * Generic type for enum values
 */
export type EnumValue = string | number;

/**
 * Generic type for label mappings
 */
export type LabelMapping<T extends EnumValue> = Record<T, string>;

/**
 * Get all enum values as an array
 */
export function getEnumValues<T extends EnumValue>(enumObject: Record<string, T>): T[] {
  return Object.values(enumObject).filter(
    (value): value is T => typeof value === 'string' || typeof value === 'number'
  );
}

/**
 * Get all enum keys as an array
 */
export function getEnumKeys<T extends Record<string, EnumValue>>(enumObject: T): (keyof T)[] {
  return Object.keys(enumObject).filter(
    (key) => isNaN(Number(key))
  ) as (keyof T)[];
}

/**
 * Get label for a specific enum value
 */
export function getEnumLabel<T extends EnumValue>(
  value: T,
  labelMapping: LabelMapping<T>
): string {
  return labelMapping[value] || String(value);
}

/**
 * Check if a value is a valid enum value
 */
export function isValidEnumValue<T extends EnumValue>(
  value: unknown,
  enumObject: Record<string, T>
): value is T {
  const validValues = getEnumValues(enumObject);
  return validValues.includes(value as T);
}

/**
 * Get random enum value (useful for testing)
 */
export function getRandomEnumValue<T extends EnumValue>(
  enumObject: Record<string, T>
): T {
  const values = getEnumValues(enumObject);
  return values[Math.floor(Math.random() * values.length)]!;
}

/**
 * Convert enum value to its key name
 */
export function getEnumKeyName<T extends EnumValue>(
  value: T,
  enumObject: Record<string, T>
): string | undefined {
  const entries = Object.entries(enumObject);
  const entry = entries.find(([, val]) => val === value);
  return entry?.[0];
}

// =============================================================================
// SECTION 9: SPECIFIC UTILITY FUNCTIONS - Domain-Specific Helpers
// =============================================================================

/**
 * Device type specific utilities
 */
export function getDeviceLabel(deviceType: DeviceType): string {
  return getEnumLabel(deviceType, DeviceTypeLabel);
}

export function isValidDeviceType(value: unknown): value is DeviceType {
  return isValidEnumValue(value, DeviceType);
}

export function isMobileDevice(deviceType: DeviceType): boolean {
  return deviceType === DeviceType.Mobile || deviceType === DeviceType.Tablet;
}

export function isDesktopDevice(deviceType: DeviceType): boolean {
  return deviceType === DeviceType.Desktop;
}

/**
 * Login method specific utilities
 */
export function getLoginMethodLabel(method: LoginMethod): string {
  return getEnumLabel(method, LoginMethodLabel);
}

export function isValidLoginMethod(value: unknown): value is LoginMethod {
  return isValidEnumValue(value, LoginMethod);
}

export function isOAuthMethod(method: LoginMethod): boolean {
  return [LoginMethod.Google, LoginMethod.Github].includes(method);
}

export function isMFAMethod(method: LoginMethod): boolean {
  return [LoginMethod.MfaTotp, LoginMethod.MfaSms].includes(method);
}

/**
 * Risk level specific utilities
 */
export function getRiskLevelLabel(level: RiskLevel): string {
  return getEnumLabel(level, RiskLevelLabel);
}

export function isValidRiskLevel(value: unknown): value is RiskLevel {
  return isValidEnumValue(value, RiskLevel);
}

export function isHighRisk(level: RiskLevel): boolean {
  return level === RiskLevel.High || level === RiskLevel.Critical;
}

/**
 * Transaction specific utilities
 */
export function getTransactionTypeLabel(type: TransactionType): string {
  return getEnumLabel(type, TransactionTypeLabel);
}

export function getTransactionStatusLabel(status: TransactionStatus): string {
  return getEnumLabel(status, TransactionStatusLabel);
}

export function isValidTransactionType(value: unknown): value is TransactionType {
  return isValidEnumValue(value, TransactionType);
}

export function isValidTransactionStatus(value: unknown): value is TransactionStatus {
  return isValidEnumValue(value, TransactionStatus);  
}

export function isTransactionCompleted(status: TransactionStatus): boolean {
  return status === TransactionStatus.Completed;
}

export function isTransactionFailed(status: TransactionStatus): boolean {
  return status === TransactionStatus.Failed;
}

/**
 * User role specific utilities
 */
export function getUserRoleLabel(role: UserRole): string {
  return getEnumLabel(role, UserRoleLabel);
}

export function isValidUserRole(value: unknown): value is UserRole {
  return isValidEnumValue(value, UserRole);
}

export function isAdminRole(role: UserRole): boolean {
  return role === UserRole.God || role === UserRole.SuperAdmin;
}

/**
 * User status specific utilities
 */
export function getUserStatusLabel(status: UserStatus): string {
  return getEnumLabel(status, UserStatusLabel);
}

export function isValidUserStatus(value: unknown): value is UserStatus {
  return isValidEnumValue(value, UserStatus);
}

export function isActiveUser(status: UserStatus): boolean {
  return status === UserStatus.Active;
}

// =============================================================================
// SECTION 10: VALIDATION HELPERS - Runtime Type Safety
// =============================================================================

/**
 * Comprehensive enum validation result
 */
export interface EnumValidationResult<T extends EnumValue> {
  isValid: boolean;
  value?: T;
  error?: string;
  suggestions?: T[];
}

/**
 * Validate enum value with detailed feedback
 */
export function validateEnumValue<T extends EnumValue>(
  value: unknown,
  enumObject: Record<string, T>,
  labelMapping: LabelMapping<T>,
  options: {
    allowUndefined?: boolean;
    allowNull?: boolean;
    caseSensitive?: boolean;
    fuzzyMatch?: boolean;
  } = {}
): EnumValidationResult<T> {
  const { allowUndefined = false, allowNull = false, caseSensitive = true, fuzzyMatch = false } = options;

  // Handle undefined/null cases
  if (value === undefined) {
    return allowUndefined 
      ? { isValid: true }
      : { isValid: false, error: "Value is undefined" };
  }

  if (value === null) {
    return allowNull
      ? { isValid: true }
      : { isValid: false, error: "Value is null" };
  }

  // Direct validation
  if (isValidEnumValue(value, enumObject)) {
    return { isValid: true, value: value as T };
  }

  // Case-insensitive matching
  if (!caseSensitive && typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    const validValues = getEnumValues(enumObject);
    const matchedValue = validValues.find(v => 
      typeof v === 'string' && v.toLowerCase() === lowerValue
    );
    
    if (matchedValue) {
      return { isValid: true, value: matchedValue as T };
    }
  }

  // Fuzzy matching for string enums
  if (fuzzyMatch && typeof value === 'string') {
    const validValues = getEnumValues(enumObject).filter((v): v is T => typeof v === 'string');
    const suggestions = validValues.filter(v => 
      (typeof v === 'string' && v.toLowerCase().includes(value.toLowerCase())) || 
      (typeof value === 'string' && value.toLowerCase().includes(value.toLowerCase()))
    );
    
    if (suggestions.length > 0) {
      return {
        isValid: false,
        error: `Invalid value "${value}". Did you mean one of: ${suggestions.join(', ')}?`,
        suggestions
      };
    }
  }

  // Generate error message with valid options
  const validValues = getEnumValues(enumObject);
  const validLabels = validValues.map(v => labelMapping[v] || String(v));
  
  return {
    isValid: false,
    error: `Invalid value "${value}". Valid options are: ${validLabels.join(', ')}`
  };
}

/**
 * Assert enum value with detailed error message
 */
export function assertEnumValue<T extends EnumValue>(
  value: unknown,
  enumObject: Record<string, T>,
  labelMapping: LabelMapping<T>,
  context?: string
): T {
  const result = validateEnumValue(value, enumObject, labelMapping);
  
  if (!result.isValid) {
    const contextMsg = context ? ` in ${context}` : '';
    throw new TypeError(`Enum validation failed${contextMsg}: ${result.error}`);
  }
  
  return result.value!;
}

// =============================================================================
// SECTION 11: CONSTANTS & CONFIGURATION - System-wide Settings
// =============================================================================

/**
 * Maximum allowed failed login attempts before account lockout
 */
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;

/**
 * Default session timeout in milliseconds (30 minutes)
 */
export const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;

/**
 * High-risk threshold score (0-100 scale)
 */
export const HIGH_RISK_THRESHOLD = 70;

/**
 * Critical-risk threshold score (0-100 scale)
 */
export const CRITICAL_RISK_THRESHOLD = 90;

/**
 * Default pagination limits
 */
export const PAGINATION_LIMITS = {
  MIN: 1,
  MAX: 1000,
  DEFAULT: 20,
} as const;

/**
 * Common regex patterns for validation
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

/**
 * All enum types union for generic operations
 */
export type AllEnumTypes = 
  | DeviceType
  | LoginMethod
  | RiskLevel
  | SessionStatus
  | ActionType
  | ResourceType
  | TransactionType
  | TransactionStatus
  | NotificationType
  | NotificationChannel
  | NotificationStatus
  | UserRole
  | UserStatus;

// =============================================================================
// SECTION 13: TESTING UTILITIES - Development & Testing Helpers
// =============================================================================

/**
 * Generate test data for enum values
 */
export function generateEnumTestData<T extends EnumValue>(
  enumObject: Record<string, T>,
  count: number = 10
): T[] {
  const values = getEnumValues(enumObject);
  const result: T[] = [];
  
  for (let i = 0; i < count; i++) {
    result.push(values[Math.floor(Math.random() * values.length)]!);
  }
  
  return result;
}

/**
 * Create enum value cycle for testing state transitions
 */
export function createEnumCycle<T extends EnumValue>(
  enumObject: Record<string, T>
): () => T {
  const values = getEnumValues(enumObject);
  let index = 0;
  
  return () => {
    const value = values[index];
    index = (index + 1) % values.length;
    return value!;
  };
}

/**
 * Benchmark enum operations
 */
export function benchmarkEnumOperations<T extends EnumValue>(
  enumObject: Record<string, T>,
  iterations: number = 100000
): {
  getValues: number;
  validation: number;
  labelLookup: number;
} {
  const values = getEnumValues(enumObject);
  const testValue = values[0];
  
  // Benchmark getEnumValues
  const start1 = performance.now();
  for (let i = 0; i < iterations; i++) {
    getEnumValues(enumObject);
  }
  const getValuesTime = performance.now() - start1;
  
  // Benchmark validation
  const start2 = performance.now();
  for (let i = 0; i < iterations; i++) {
    isValidEnumValue(testValue, enumObject);
  }
  const validationTime = performance.now() - start2;
  
  // Benchmark label lookup (if applicable)
  let labelLookupTime = 0;
  if ((enumObject as unknown) === DeviceType) {
    const start3 = performance.now();
    for (let i = 0; i < iterations; i++) {
      getDeviceLabel(testValue as DeviceType);
    }
    labelLookupTime = performance.now() - start3;
  }
  
  return {
    getValues: getValuesTime,
    validation: validationTime,
    labelLookup: labelLookupTime,
  };
}

// =============================================================================
// END OF FILE - Enterprise Enum System Complete
// =============================================================================
