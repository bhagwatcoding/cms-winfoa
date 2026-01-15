/**
 * Settings Validation Schemas
 * Validation logic for user settings and preferences
 */

import { z } from 'zod';

export const settingsChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(1, 'New password is required'),
    confirmPassword: z.string().min(1, 'Confirm password is required')
});

export const emailNotifSchema = z.object({
    marketing: z.boolean().optional(),
    updates: z.boolean().optional(),
    security: z.boolean().optional(),
    newsletter: z.boolean().optional()
});

export const pushNotifSchema = z.object({
    enabled: z.boolean().optional(),
    browser: z.boolean().optional(),
    mobile: z.boolean().optional()
});

export const privacySchema = z.object({
    profileVisibility: z.enum(['public', 'private', 'friends']).optional(),
    showEmail: z.boolean().optional(),
    showActivity: z.boolean().optional()
});

export const themeSchema = z.enum(['light', 'dark', 'system']);
