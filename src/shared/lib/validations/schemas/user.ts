/**
 * User Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// USER ROLES & STATUS
// ==========================================

export const userRoleSchema = z.enum([
    'super-admin',
    'admin',
    'staff',
    'student',
    'user',
    'center'
]);

export const userStatusSchema = z.enum([
    'active',
    'inactive',
    'on-leave'
]);

// ==========================================
// CREATE USER SCHEMA
// ==========================================

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    firstName: z
        .string()
        .min(1, 'First name must be at least 1 character')
        .max(50, 'First name must not exceed 50 characters')
        .trim()
        .optional(),
    lastName: z
        .string()
        .min(1, 'Last name must be at least 1 character')
        .max(50, 'Last name must not exceed 50 characters')
        .trim()
        .optional(),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must not exceed 100 characters')
        .optional(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    role: userRoleSchema.default('user'),
    status: userStatusSchema.default('active'),
    centerId: z.string().optional(),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
    emailVerified: z.boolean().default(false).optional(),
    isActive: z.boolean().default(true).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ==========================================
// UPDATE USER SCHEMA
// ==========================================

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
        .optional(),
    firstName: z
        .string()
        .min(1, 'First name must be at least 1 character')
        .max(50, 'First name must not exceed 50 characters')
        .trim()
        .optional(),
    lastName: z
        .string()
        .min(1, 'Last name must be at least 1 character')
        .max(50, 'Last name must not exceed 50 characters')
        .trim()
        .optional(),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    role: userRoleSchema.optional(),
    status: userStatusSchema.optional(),
    centerId: z.string().optional(),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
    emailVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ==========================================
// USER PROFILE SCHEMA
// ==========================================

export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
        .optional(),
    firstName: z
        .string()
        .min(1, 'First name must be at least 1 character')
        .max(50, 'First name must not exceed 50 characters')
        .trim()
        .optional(),
    lastName: z
        .string()
        .min(1, 'Last name must be at least 1 character')
        .max(50, 'Last name must not exceed 50 characters')
        .trim()
        .optional(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==========================================
// USER PREFERENCES SCHEMA
// ==========================================

export const updateUserPreferencesSchema = z.object({
    language: z.string().min(2).max(10).optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    notifications: z.object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        sms: z.boolean().optional(),
    }).optional(),
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;

// ==========================================
// BULK USER OPERATIONS
// ==========================================

export const bulkDeleteUsersSchema = z.object({
    userIds: z
        .array(z.string())
        .min(1, 'At least one user ID is required')
        .max(100, 'Cannot delete more than 100 users at once'),
});

export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>;

export const bulkUpdateUsersSchema = z.object({
    userIds: z
        .array(z.string())
        .min(1, 'At least one user ID is required')
        .max(100, 'Cannot update more than 100 users at once'),
    updates: z.object({
        status: userStatusSchema.optional(),
        role: userRoleSchema.optional(),
        isActive: z.boolean().optional(),
    }),
});

export type BulkUpdateUsersInput = z.infer<typeof bulkUpdateUsersSchema>;

// ==========================================
// USER SEARCH/FILTER SCHEMA
// ==========================================

export const userFilterSchema = z.object({
    search: z.string().optional(),
    role: userRoleSchema.optional(),
    status: userStatusSchema.optional(),
    isActive: z.boolean().optional(),
    centerId: z.string().optional(),
    page: z.number().int().positive().default(1).optional(),
    limit: z.number().int().positive().max(100).default(10).optional(),
    sortBy: z.enum(['name', 'email', 'createdAt', 'lastLogin']).default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export type UserFilterInput = z.infer<typeof userFilterSchema>;
