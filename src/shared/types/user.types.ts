/**
 * User Types
 * All TypeScript interfaces and types for user management
 */

import { Document, Types } from 'mongoose';
import { ISoftDelete } from '@/types/base.types';

// ==========================================
// USER PROFILE TYPES
// ==========================================

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

// ==========================================
// USER ROLE TYPES
// ==========================================

export type UserRole = 'god' | 'admin' | 'user';

export interface IUserRole {
    _id: Types.ObjectId;
    name: string;
    slug: UserRole;
    description?: string;
    permissions: string[];
    isActive: boolean;
    isSystem: boolean;
    level: number;
}

// ==========================================
// USER INTERFACE
// ==========================================

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

    // Status
    status: "active" | "inactive" | "suspended" | "pending";
    statusReason?: string;
    statusChangedAt?: Date;
    statusChangedBy?: Types.ObjectId;

    // Metadata
    metadata?: Record<string, unknown>;
    tags?: string[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    loginCount?: number;

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
    fullName: string;
    initials: string;
    displayName: string;
}

// ==========================================
// USER DTOs
// ==========================================

export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    roleId: string;
    avatar?: string;
    profile?: Partial<IUserProfile>;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    profile?: Partial<IUserProfile>;
    preferences?: Partial<IUserPreferences>;
}

export interface UserFilterOptions {
    role?: string;
    status?: string;
    emailVerified?: boolean;
    search?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

export interface UserSafeData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
    lastActiveAt?: Date;
}