/**
 * Authentication Validation Schemas
 * Centralized validation for auth actions
 */

import { z } from 'zod';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

export const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional().default(false),
});

export const signupSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    role: z.string().optional().default('user'),
    acceptTerms: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions',
    }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
});

export const verifyEmailSchema = z.object({
    token: z.string()
        .min(1, 'Verification token is required'),
});

export const updateProfileSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .trim()
        .optional(),
    email: z.string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional(),
    phone: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
});

// ==========================================
// TYPE EXPORTS
// ==========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
