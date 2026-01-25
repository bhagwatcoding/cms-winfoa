/**
 * Authentication Types
 * All TypeScript interfaces and types for authentication module
 */

import {
  DeviceType,
  IDeviceInfo,
  LoginMethod,
  RiskLevel,
  SessionStatus,
  ThemeMode,
} from '@/core/db/interfaces';
import { Document } from 'mongoose';

// ==========================================
// SESSION TYPES
// ==========================================

export interface ISecurityInfo {
  loginMethod?: LoginMethod;
  riskScore?: number;
  riskLevel?: RiskLevel;
  isVerified?: boolean;
  failedAttempts?: number;
}

export interface ISessionBase {
  userId: string;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  location?: string;
  deviceInfo?: IDeviceInfo;
  securityInfo?: ISecurityInfo;
  isActive: boolean;
  status: SessionStatus;
  isRememberMe?: boolean;
  lastAccessedAt: Date;
  loginAt: Date;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Document Interface
export interface ISession extends ISessionBase, Document {}

// ==========================================
// SERVICE DTOs
// ==========================================

export interface SessionCreateOptions {
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  rememberMe?: boolean;
  deviceInfo?: IDeviceInfo;
}

export interface SessionMiddlewareOptions {
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectUrl?: string;
}

export interface SessionStats {
  total: number;
  active: number;
  expired: number;
  inactive: number;
  byDevice?: DeviceType[];
}

// ==========================================
// AUTH HELPER TYPES
// ==========================================

export interface RequestMetadata {
  userAgent?: string;
  ipAddress?: string;
  os?: string;
  device?: string;
  browser?: string;
  referer?: string;
  origin?: string;
  location?: string;
}

export interface SessionSignature {
  userId: string;
  sessionId: string;
  token: string;
  signature: string;
  expiresAt: Date;
  deviceInfo: IDeviceInfo & { ipAddress?: string };
}

export interface UserSafeData {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  avatar?: string;
  phone?: string;
}

// ==========================================
// ACTION RESULTS
// ==========================================

export interface AuthActionResult<T = unknown> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
  code?: string;
  timestamp?: string;
}

export interface LoginResult {
  user: UserSafeData;
  session: SessionSignature;
}

export interface SessionListItem {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  signature: SessionSignature;
}

// ==========================================
// DEVICE INFO TYPES
// ==========================================

// export interface IDeviceInfo {
//   type?: DeviceType;
//   name?: string;
//   version?: string;
//   os?: string;
//   osVersion?: string;
//   screenResolution?: string;
//   language?: string;
//   theme?: 'dark' | 'light';
// }

export interface IClientMeta {
  screenResolution?: string;
  language?: string;
  theme?: ThemeMode;
  referrer?: string;
}

export interface IGeoInfo {
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}
