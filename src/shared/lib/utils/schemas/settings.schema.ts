/**
 * Settings Schemas
 * Zod validation schemas for user settings
 */

import { z } from 'zod';

// ==========================================
// CHANGE PASSWORD SCHEMA (for settings page)
// ==========================================

export const settingsChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type SettingsChangePasswordInput = z.infer<typeof settingsChangePasswordSchema>;

// ==========================================
// EMAIL NOTIFICATION SCHEMA
// ==========================================

export const emailNotifSchema = z.object({
    marketing: z.boolean(),
    updates: z.boolean(),
    security: z.boolean(),
});

export type EmailNotifInput = z.infer<typeof emailNotifSchema>;

// ==========================================
// PUSH NOTIFICATION SCHEMA
// ==========================================

export const pushNotifSchema = z.object({
    enabled: z.boolean(),
    messages: z.boolean(),
    alerts: z.boolean(),
});

export type PushNotifInput = z.infer<typeof pushNotifSchema>;

// ==========================================
// PRIVACY SCHEMA
// ==========================================

export const privacySchema = z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
});

export type PrivacyInput = z.infer<typeof privacySchema>;
