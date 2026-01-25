/**
 * Settings Validation Schemas
 * All Zod schemas for settings and configuration validation
 */

import { z } from 'zod';

// ==========================================
// USER PREFERENCES SCHEMAS
// ==========================================

export const userPreferencesSchema = z.object({
  language: z
    .string()
    .min(2, 'Language must be at least 2 characters')
    .max(10, 'Language must not exceed 10 characters')
    .default('en'),
  timezone: z.string().min(1, 'Timezone is required').default('UTC'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;

// ==========================================
// NOTIFICATION PREFERENCES SCHEMAS
// ==========================================

export const notificationPreferencesSchema = z.object({
  email: z.object({
    loginAlerts: z.boolean().default(true),
    passwordChanges: z.boolean().default(true),
    securityAlerts: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
    newsletter: z.boolean().default(false),
    systemUpdates: z.boolean().default(true),
  }),
  push: z.object({
    loginAlerts: z.boolean().default(true),
    transactionAlerts: z.boolean().default(true),
    securityAlerts: z.boolean().default(true),
    marketingPush: z.boolean().default(false),
    systemUpdates: z.boolean().default(true),
  }),
  sms: z.object({
    loginAlerts: z.boolean().default(false),
    transactionAlerts: z.boolean().default(false),
    securityAlerts: z.boolean().default(false),
    marketingSms: z.boolean().default(false),
  }),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

// ==========================================
// PRIVACY SETTINGS SCHEMAS
// ==========================================

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'friends', 'private']).default('private'),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  allowSearchByEmail: z.boolean().default(true),
  allowSearchByPhone: z.boolean().default(false),
  dataSharing: z.boolean().default(false),
  analyticsTracking: z.boolean().default(true),
});

export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;

// ==========================================
// SECURITY SETTINGS SCHEMAS
// ==========================================

export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  twoFactorMethod: z.enum(['totp', 'sms', 'email']).optional(),
  trustedDevices: z.array(z.string()).max(10, 'Maximum 10 trusted devices allowed').default([]),
  sessionTimeout: z
    .number()
    .min(5, 'Session timeout must be at least 5 minutes')
    .max(1440, 'Session timeout must not exceed 24 hours')
    .default(60),
  passwordExpiryReminder: z.boolean().default(true),
  loginAlerts: z.boolean().default(true),
});

export type SecuritySettingsInput = z.infer<typeof securitySettingsSchema>;

// ==========================================
// PROFILE SETTINGS SCHEMAS
// ==========================================

export const profileSettingsSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must not exceed 50 characters')
    .trim()
    .optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  socialLinks: z
    .object({
      twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
      linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
      github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
    })
    .optional(),
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;

// ==========================================
// SYSTEM SETTINGS SCHEMAS
// ==========================================

export const systemSettingsSchema = z.object({
  maintenanceMode: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(true),
  maxLoginAttempts: z
    .number()
    .min(3, 'Maximum login attempts must be at least 3')
    .max(10, 'Maximum login attempts must not exceed 10')
    .default(5),
  lockoutDuration: z
    .number()
    .min(5, 'Lockout duration must be at least 5 minutes')
    .max(1440, 'Lockout duration must not exceed 24 hours')
    .default(30),
  passwordMinLength: z
    .number()
    .min(6, 'Password minimum length must be at least 6')
    .max(20, 'Password minimum length must not exceed 20')
    .default(8),
  passwordComplexity: z.boolean().default(true),
  sessionTimeout: z
    .number()
    .min(5, 'Session timeout must be at least 5 minutes')
    .max(1440, 'Session timeout must not exceed 24 hours')
    .default(60),
});

export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;
