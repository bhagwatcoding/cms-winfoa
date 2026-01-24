/**
 * Core Database Model Interfaces
 * Central type definitions for all database models
 */

import type { Document, Types } from 'mongoose';
import { DeviceType, LoginMethod, RiskLevel, SessionStatus } from '../enums';

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
  loginMethod?: string;
  _id?: Types.ObjectId;
}

export interface ILinkedAccount {
  provider: "google" | "github" | "microsoft" | "apple";
  providerId: string;
  email?: string;
  name?: string;
  avatar?: string;
  linkedAt: Date;
  lastUsedAt?: Date;
}

export interface IUserProfile {
  bio?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
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
  theme: "light" | "dark" | "system";
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
  method?: "totp" | "sms" | "email";
}

export interface IUser extends Document, ISoftDelete {
  // Core identity
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;

  // Role & Permissions
  roleId: Types.ObjectId | { _id: Types.ObjectId; slug: string; name: string; permissions: string[] };
  role?: string; // Virtual for role slug
  customPermissions?: string[];
  permissionOverrides?: string[];
  subdomainAccess?: string[];
  isGod: boolean;

  // Profile
  avatar?: string;
  profile?: IUserProfile;
  preferences: IUserPreferences;

  // Email verification
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  // Phone verification
  phoneVerified?: boolean;
  phoneVerifiedAt?: Date;

  // Two-Factor Authentication
  twoFactor: ITwoFactorSettings;

  // Account security
  accountLocked: boolean;
  lockoutUntil?: Date;
  failedLoginAttempts: number;
  lastFailedLoginAt?: Date;
  lastPasswordChangeAt?: Date;
  passwordHistory?: string[]; // Last 5 password hashes
  requirePasswordChange?: boolean;

  // OAuth / Linked Accounts
  linkedAccounts: ILinkedAccount[];

  // Trusted Devices
  trustedDevices: string[];

  // Login History (last 10)
  loginHistory: ILoginHistory[];

  // Activity timestamps
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  lastLoginIp?: string;

  // Compatibility fields
  oauthProvider?: string;
  lastLogin?: Date;

  // Status
  status: "active" | "inactive" | "suspended" | "pending";
  statusReason?: string;
  statusChangedAt?: Date;
  statusChangedBy?: Types.ObjectId;

  // Soft Delete (Inherited from ISoftDelete)
  // isDeleted: boolean;
  // deletedAt?: Date;
  // deletedBy?: string;

  // Metadata
  metadata?: Record<string, unknown>;
  tags?: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  loginCount?: number;

  // Extended properties used by API routes
  walletBalance?: number;
  isActive?: boolean;
  joinedAt?: Date;
  umpUserId?: string;

  // Instance Methods
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
  unlinkAccount(provider: string): Promise<IUser>;

  // Virtuals
  id: string; // Virtual getter for _id.toString()
  name: string; // Virtual for fullName
  fullName: string;
  initials: string;
  displayName: string;
}

// ==========================================
// SESSION INTERFACE
// ==========================================

// 🆕 CLIENT METADATA (Frontend se bheja hua)
export interface IClientMeta {
  screenResolution?: string;
  language?: string;
  theme?: "dark" | "light";
  referrer?: string;
}

// 🆕 GEO-LOCATION INFO
export interface IGeoInfo {
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  timezone?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
  isp?: string;
}

export interface IDeviceInfo {
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  device?: string;
  type?: DeviceType | number; // Allow number for compatibility with older definitions
  isMobile?: boolean;
  isBot?: boolean;
  deviceId?: string;
  clientMeta?: IClientMeta;
}

export interface ISecurityInfo {
  loginMethod: LoginMethod;
  riskScore: number;
  riskLevel: RiskLevel;
  isVerified: boolean;
  failedAttempts: number;
  isVpn?: boolean;
  isTor?: boolean;
  mfaEnabled?: boolean;
  mfaVerified?: boolean;
  lastPasswordChange?: Date;
}

export interface ISession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;

  deviceInfo?: IDeviceInfo;

  geoInfo?: IGeoInfo;

  isActive: boolean;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// The Clean Result returned to Frontend
export interface ISessionResult {
  _id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  status: SessionStatus;

  deviceInfo?: Partial<IDeviceInfo>;
  geoInfo?: Partial<IGeoInfo>;

  lastAccessedAt?: Date;
  createdAt?: Date;
  isCurrentSession?: boolean;
}

// ==========================================
// ACTIVITY LOG INTERFACE
// ==========================================

export interface IActivityLog extends Document {
  _id: Types.ObjectId;
  actorId: Types.ObjectId;
  action: number; // ActionType enum
  resource: number; // ResourceType enum
  resourceId?: string;
  details?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ==========================================
// API MANAGEMENT INTERFACES
// ==========================================

export enum ApiKeyScope {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ADMIN = "admin",
}

export enum ApiKeyEnvironment {
  LIVE = "live",
  TEST = "test",
}

export interface IApiKey extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  // Identification
  name: string;
  description?: string;

  // Key (only prefix and hash stored)
  keyPrefix: string;
  keyHash: string;

  // Configuration
  environment: ApiKeyEnvironment;
  scopes: ApiKeyScope[];
  permissions: string[];

  // Limits
  rateLimit: number;
  dailyLimit?: number;

  // Restrictions
  allowedIps?: string[];
  allowedDomains?: string[];
  allowedOrigins?: string[];

  // Usage tracking
  usageCount: number;
  lastUsedAt?: Date;
  lastUsedIp?: string;

  // Status
  isActive: boolean;
  expiresAt?: Date;
  revokedAt?: Date;
  revokedBy?: Types.ObjectId;
  revokedReason?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface IApiRequest extends Document {
  _id: Types.ObjectId;
  apiKeyId: Types.ObjectId;
  userId: Types.ObjectId;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  ipAddress?: string;
  userAgent?: string;
  requestBody?: Record<string, unknown>;
  responseBody?: Record<string, unknown>;
  error?: string;
  timestamp: Date;
}

// ==========================================
// ADDITIONAL TYPES
// ==========================================

export type UserRole = 'god' | 'super-admin' | 'user';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export type OAuthProvider = 'google' | 'github' | 'microsoft' | 'apple';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface IUserRegistry extends Document {
  userId: string; // Unique user ID (e.g., WIN-2024-0001)
  email: string;
  role: string;
  status: UserStatus;
  createdBy: Types.ObjectId | string
  registeredAt: Date
  metadata: {
    subdomain?: string
    source?: string
    [key: string]: unknown
  }
}