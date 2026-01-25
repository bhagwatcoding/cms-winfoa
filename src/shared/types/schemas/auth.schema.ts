/**
 * Authentication Validation Schemas
 * All Zod schemas for authentication validation
 */

import { z } from 'zod';

// ==========================================
// LOGIN SCHEMAS
// ==========================================

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ==========================================
// SIGNUP SCHEMAS
// ==========================================

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
      .optional()
      .or(z.literal('')),
    role: z
      .enum(['god', 'user', 'admin', 'staff'] as const)
      .default('user')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

// ==========================================
// FORGOT PASSWORD SCHEMAS
// ==========================================

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address').toLowerCase().trim(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ==========================================
// RESET PASSWORD SCHEMAS
// ==========================================

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ==========================================
// CHANGE PASSWORD SCHEMAS
// ==========================================

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ==========================================
// VERIFY EMAIL SCHEMAS
// ==========================================

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
  email: z.string().email('Invalid email address').toLowerCase().trim().optional(),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

// ==========================================
// SESSION SCHEMAS
// ==========================================

export const sessionCreateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

export type SessionCreateInput = z.infer<typeof sessionCreateSchema>;

// ==========================================
// DEVICE INFO SCHEMAS
// ==========================================

export const deviceInfoSchema = z.object({
  type: z.enum(['desktop', 'mobile', 'tablet', 'unknown']).optional(),
  name: z.string().optional(),
  version: z.string().optional(),
  os: z.string().optional(),
  osVersion: z.string().optional(),
  screenResolution: z.string().optional(),
  language: z.string().optional(),
  theme: z.enum(['dark', 'light']).optional(),
});

export type DeviceInfoInput = z.infer<typeof deviceInfoSchema>;
