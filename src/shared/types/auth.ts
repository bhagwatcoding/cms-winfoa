/**
 * Authentication & Session Types
 * Centralized type definitions for the authentication module
 */

import { Document } from 'mongoose';
import { DeviceType, LoginMethod, RiskLevel, SessionStatus } from './enums';
import { IUser, IDeviceInfo } from './models'; // Assuming IUser is defined in models type file

// ==========================================
// SESSION INTERFACES
// ==========================================

export interface ISecurityInfo {
    loginMethod?: LoginMethod; // Numeric Enum
    riskScore?: number; // 0-100
    riskLevel?: RiskLevel; // Numeric Enum
    isVerified?: boolean; // Email/2FA verified
    failedAttempts?: number;
}

export interface ISessionBase {
    userId: string;
    token: string;
    expiresAt: Date;

    // Request metadata
    userAgent?: string;
    ipAddress?: string;
    location?: string;

    // Device information
    deviceInfo?: IDeviceInfo;

    // Security information
    securityInfo?: ISecurityInfo;

    // Session state
    isActive: boolean;
    status: SessionStatus;
    isRememberMe?: boolean;

    // Activity tracking
    lastAccessedAt: Date;
    loginAt: Date;

    // Metadata
    notes?: string;
    tags?: string[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Document Interface
export interface ISession extends ISessionBase, Document { }

// ==========================================
// SERVICE DTOs (Data Transfer Objects)
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
    allowedRoles?: string[]; // Assuming simple string here to avoid complex import cycles
    redirectUrl?: string;
}

export interface SessionStats {
    total: number;
    active: number;
    expired: number;
    inactive: number; // Added missing field
    byDevice?: {
        mobile: number;
        desktop: number;
        tablet: number;
        unknown: number;
    };
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

export interface AuthActionResult<T = any> {
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
