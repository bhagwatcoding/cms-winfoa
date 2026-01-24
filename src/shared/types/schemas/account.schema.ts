/**
 * Account Validation Schemas
 * Additional schemas for account management operations
 */

import { z } from 'zod';

// ==========================================
// CHANGE EMAIL SCHEMAS
// ==========================================

export const changeEmailSchema = z.object({
    newEmail: z
        .string()
        .min(1, 'New email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

// ==========================================
// ACCOUNT DELETION SCHEMAS
// ==========================================

export const accountDeletionSchema = z.object({
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
    reason: z
        .string()
        .max(500, 'Reason must not exceed 500 characters')
        .optional(),
    confirmText: z
        .string()
        .refine((val) => val === 'DELETE MY ACCOUNT', {
            message: 'Please type "DELETE MY ACCOUNT" to confirm',
        }),
});

export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>;