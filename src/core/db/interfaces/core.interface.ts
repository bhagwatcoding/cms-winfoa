/**
 * Core Database Model Interfaces
 * Central type definitions for all database models
 */

import type { Document, Types } from 'mongoose';
import {
  DeviceType,
  LoginMethod,
  SessionStatus,
  UserStatus,
  ThemeMode,
  OAuthProvider,
} from '@/core/db/enums';
import { Gender } from '@/core/db/enums';
import { BrowserType, OSType } from '@/core/types/enums';

// ==========================================
// USER INTERFACE
// ==========================================

/**
 * Soft Delete Trait
 * Enables logical deletion while maintaining data integrity
 */
export interface ISoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface ILoginHistory {
  ip: string;
  country?: string;
  city?: string;
  device: string;
  browser?: string;
  os?: string;
  loginAt: Date;
  sessionId?: Types.ObjectId;
  loginMethod?: LoginMethod; // Numeric Enum
  _id?: Types.ObjectId;
}

export interface ILinkedAccount {
  provider: OAuthProvider; // Numeric Enum
  providerId: string;
  email?: string;
  name?: string;
  avatar?: string;
  linkedAt: Date;
  lastUsedAt?: Date;
}
export interface IGender {
  name: Gender;
}

export interface ISocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IUserProfile {
  bio?: string;
  dateOfBirth?: Date;
  gender?: IGender;
  address?: IAddress;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface IUserPreferences {
  language: string;
  timezone: string;
  theme: ThemeMode; // Numeric Enum
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

export interface ITwoFactorSettings {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[]; // Hashed
  enabledAt?: Date;
  lastUsedAt?: Date;
  method?: LoginMethod; // Use LoginMethod for factor types (TOTP, SMS) or define separate if needed
}

export interface IUser extends Document, ISoftDelete {
  // Core identity
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;

  // Role & Permissions
  roleId:
    | Types.ObjectId
    | {
        slug: string;
        name: string;
        permissions: string[];
      };
  customPermissions: string[];
  permissionOverrides: string[];
  subdomainAccess: string[];
  isGod: boolean;

  // Profile
  avatar?: string;
  profile?: IUserProfile;
  preferences?: IUserPreferences;

  // Email Verification
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  // Phone Verification
  phoneVerified: boolean;
  phoneVerifiedAt?: Date;

  // Two-Factor Authentication
  twoFactor: ITwoFactorSettings;

  // UMP Integration
  umpUserId?: string;

  // Wallet
  walletBalance: number;

  // Account Security
  accountLocked: boolean;
  lockoutUntil?: Date;
  failedLoginAttempts: number;
  lastFailedLoginAt?: Date;
  lastPasswordChangeAt?: Date;
  passwordHistory?: string[];
  requirePasswordChange: boolean;

  // OAuth / Linked Accounts
  linkedAccounts: ILinkedAccount[];

  // Trusted Devices
  trustedDevices: string[];

  // Login History
  loginHistory: ILoginHistory[];

  // Activity
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  lastLoginIp?: string;

  // Status
  status: UserStatus; // Numeric Enum
  statusReason?: string;
  statusChangedAt?: Date;
  statusChangedBy?: Types.ObjectId;

  // Metadata
  metadata?: Record<string, unknown>;
  tags: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  fullName: string;
  name: string;
  initials: string;
  displayName: string;
  role?: string;
  id: string;
  isActive: boolean;
  joinedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  lock(duration?: number, reason?: string): Promise<IUser>;
  unlock(): Promise<IUser>;
  recordFailedLogin(): Promise<IUser>;
  recordSuccessfulLogin(ip?: string, sessionId?: Types.ObjectId): Promise<IUser>;
  addToLoginHistory(entry: Partial<ILoginHistory>): Promise<IUser>;
  updateLastActive(): Promise<IUser>;
  enable2FA(secret: string, backupCodes: string[]): Promise<IUser>;
  disable2FA(): Promise<IUser>;
  verify2FA(code: string): boolean;
  changePassword(newPassword: string): Promise<IUser>;
  linkAccount(account: ILinkedAccount): Promise<IUser>;
  unlinkAccount(provider: OAuthProvider): Promise<IUser>; // Numeric
}

// ==========================================
// SESSION INTERFACE
// ==========================================

export interface ISession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;

  // Device & Location (Modern)
  deviceInfo: IDeviceInfo;
  geoInfo: IGeoInfo;
  securityInfo?: ISecurityInfo;

  // Status
  status: SessionStatus; // Numeric
  isActive: boolean;
  isValid: boolean;

  // Timestamps
  expiresAt: Date;
  lastAccessedAt: Date; // Replaces or aliases lastActiveAt
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionResult {
  token: string;
  user: IUser;
  expiresAt: Date;
}

export interface IDeviceInfo {
  browser?: BrowserType | string;
  os?: OSType | string;
  type?: DeviceType;
  device?: DeviceType; // Compatibility
  isMobile?: boolean;
  deviceId?: string;
  name?: string; // For friendly name
  ip?: string;
  userAgent?: string;
}

export interface coordinates {
  latitude: number;
  longitude: number;
}

export interface IGeoInfo {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  coordinates?: coordinates;
  timezone?: string;
}

export interface ISecurityInfo {
  isSecure?: boolean;
  isTor?: boolean;
  isProxy?: boolean;
  isDatacenter?: boolean;
  riskLevel?: number;
  riskScore?: number;
}

export interface IClientMeta {
  device: IDeviceInfo;
  geo: IGeoInfo;
  security?: ISecurityInfo;
}

export interface IApiRequest extends Document {
  keyId?: Types.ObjectId;
  userId?: Types.ObjectId;
  method: string;
  path: string;
  ip: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IActivityLog extends Document {
  // ... (Managed in separate file now, but ensuring core works)
  _id: Types.ObjectId;
}

export interface IUserRegistry extends Document {
  // ... (Managed in separate file)
  _id: Types.ObjectId;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  types: Record<string, boolean>;
}
