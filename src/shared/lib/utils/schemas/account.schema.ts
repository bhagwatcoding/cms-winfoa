/**
 * Account Management Schemas
 * Zod validation schemas for account operations
 */

import { z } from 'zod';

// ==========================================
// CHANGE EMAIL SCHEMA
// ==========================================

export const changeEmailSchema = z.object({
    newEmail: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

// ==========================================
// ACCOUNT DELETION SCHEMA
// ==========================================

export const accountDeletionSchema = z.object({
    password: z.string().min(1, 'Password is required'),
    confirmation: z.string().min(1, 'Confirmation is required'),
}).refine((data) => data.confirmation === 'DELETE', {
    message: 'Please type DELETE to confirm',
    path: ['confirmation'],
});

export type AccountDeletionInput = z.infer<typeof accountDeletionSchema>;
