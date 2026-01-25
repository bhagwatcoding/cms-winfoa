/**
 * Global Enums definitions
 * Using numeric enums for database optimization
 */

// ==========================================
// 1. USER
// ==========================================

export enum UserRole {
  USER = 1,
  SUPER_ADMIN = 2,
  ADMIN = 3,
  PROVIDER = 4,
  UMP = 5,
}

export const User = {
  /** The numeric Enum */
  Role: UserRole,

  /** Display Labels for UI */
  Label: {
    [UserRole.USER]: 'User',
    [UserRole.SUPER_ADMIN]: 'Super Admin',
    [UserRole.ADMIN]: 'Admin',
    [UserRole.PROVIDER]: 'Provider',
    [UserRole.UMP]: 'UMP',
  } as Record<UserRole, string>,

  /** Status Colors/Badges */
  Color: {
    [UserRole.USER]: '#28a745',
    [UserRole.SUPER_ADMIN]: '#ffc107',
    [UserRole.ADMIN]: '#dc3545',
    [UserRole.PROVIDER]: '#000000',
    [UserRole.UMP]: '#6c757d',
  } as Record<UserRole, string>,
} as const;

// ==========================================
// 2. LOGIN METHODS
// ==========================================

export enum LoginMethod {
  PASSWORD = 0,
  OAUTH = 1,
  MAGIC_LINK = 2,
  OTP = 3,
}

export const Login = {
  Method: LoginMethod,

  Label: {
    [LoginMethod.PASSWORD]: 'Password',
    [LoginMethod.OAUTH]: 'OAuth',
    [LoginMethod.MAGIC_LINK]: 'Magic Link',
    [LoginMethod.OTP]: 'OTP',
  } as Record<LoginMethod, string>,
} as const;

// ==========================================
// 3. DEVICE TYPES
// ==========================================

export enum DeviceType {
  DESKTOP = 1,
  MOBILE = 2,
  TABLET = 3,
  UNKNOWN = 4,
}

export const Device = {
  Type: DeviceType,

  Label: {
    [DeviceType.DESKTOP]: 'Desktop',
    [DeviceType.MOBILE]: 'Mobile',
    [DeviceType.TABLET]: 'Tablet',
    [DeviceType.UNKNOWN]: 'Unknown',
  } as Record<DeviceType, string>,
} as const;

// ==========================================
// 4. OS TYPES
// ==========================================

export enum OsType {
  WINDOWS = 1,
  MAC = 2,
  LINUX = 3,
  ANDROID = 4,
  IOS = 5,
  UNKNOWN = 6,
}

export const OS = {
  Type: OsType,

  Label: {
    [OsType.WINDOWS]: 'Windows',
    [OsType.MAC]: 'macOS',
    [OsType.LINUX]: 'Linux',
    [OsType.ANDROID]: 'Android',
    [OsType.IOS]: 'iOS',
    [OsType.UNKNOWN]: 'Unknown',
  } as Record<OsType, string>,
} as const;

// ==========================================
// 5. RISK LEVELS
// ==========================================

export enum RiskLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export const Risk = {
  Level: RiskLevel,
  Label: {
    [RiskLevel.LOW]: 'Low',
    [RiskLevel.MEDIUM]: 'Medium',
    [RiskLevel.HIGH]: 'High',
    [RiskLevel.CRITICAL]: 'Critical',
  } as Record<RiskLevel, string>,

  Color: {
    [RiskLevel.LOW]: '#28a745',
    [RiskLevel.MEDIUM]: '#ffc107',
    [RiskLevel.HIGH]: '#dc3545',
    [RiskLevel.CRITICAL]: '#000000',
  } as Record<RiskLevel, string>,
} as const;

// ==========================================
// 6. SESSION STATUS
// ==========================================

export enum SessionStatus {
  ACTIVE = 1,
  EXPIRED = 2,
  REVOKED = 3,
  INACTIVE = 4,
}

export const Session = {
  Status: SessionStatus,
  Label: {
    [SessionStatus.ACTIVE]: 'Active',
    [SessionStatus.EXPIRED]: 'Expired',
    [SessionStatus.REVOKED]: 'Revoked',
    [SessionStatus.INACTIVE]: 'Inactive',
  } as Record<SessionStatus, string>,

  Color: {
    [SessionStatus.ACTIVE]: '#28a745',
    [SessionStatus.EXPIRED]: '#ffc107',
    [SessionStatus.REVOKED]: '#dc3545',
    [SessionStatus.INACTIVE]: '#6c757d',
  } as Record<SessionStatus, string>,
} as const;
