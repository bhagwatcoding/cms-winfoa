/**
 * Core Database Model Interfaces
 * Central type definitions for all database models
 */

import type { Document, Types } from 'mongoose';

// ==========================================
// USER INTERFACE
// ==========================================

export interface IUser extends Document {
    _id: Types.ObjectId;
    umpUserId?: string;
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    image?: string;
    avatar?: string;

    // ✨ NEW: Role Reference (Dynamic from database)
    roleId?: Types.ObjectId; // Reference to Role model
    role: UserRole; // Kept for backward compatibility (will be synced with roleId)

    phone?: string;
    status: UserStatus;
    centerId?: Types.ObjectId;
    joinedAt: Date;
    oauthProvider?: OAuthProvider;
    oauthId?: string;
    emailVerified: boolean;
    isActive: boolean;
    lastLogin?: Date;

    // ✨ Custom Permissions (Database-driven)
    customPermissions?: string[];
    permissionOverrides?: string[];

    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserRole = 'super-admin' | 'admin' | 'staff' | 'student' | 'user' | 'center';
export type UserStatus = 'active' | 'inactive' | 'on-leave';
export type OAuthProvider = 'google' | 'github';

// ==========================================
// SESSION INTERFACE
// ==========================================

export interface ISession extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// USER PREFERENCES INTERFACE
// ==========================================

export interface IUserPreferences extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    theme: ThemeMode;
    language: string;
    notifications: NotificationSettings;
    createdAt: Date;
    updatedAt: Date;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
}

// ==========================================
// ACTIVITY LOG INTERFACE
// ==========================================

export interface IActivityLog extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    action: string;
    description: string;
    ipAddress: string;
    userAgent: string;
    metadata?: Record<string, unknown>;
    timestamp: Date;
}

// ==========================================
// API KEY INTERFACE
// ==========================================

export interface IApiKey extends Document {
    _id: Types.ObjectId;
    key: string;
    userId: Types.ObjectId;
    name: string;
    permissions: string[];
    isActive: boolean;
    expiresAt?: Date;
    lastUsed?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ==========================================
// API REQUEST INTERFACE
// ==========================================

export interface IApiRequest extends Document {
    _id: Types.ObjectId;
    apiKeyId: Types.ObjectId;
    userId: Types.ObjectId;
    method: string;
    path: string;
    statusCode: number;
    responseTime: number;
    ipAddress: string;
    timestamp: Date;
}

// ==========================================
// USER REGISTRY INTERFACE
// ==========================================

export interface IUserRegistry extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    umpUserId: string;
    registeredAt: Date;
    status: UserStatus;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
