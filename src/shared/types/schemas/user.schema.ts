/**
 * User Validation Schemas
 * All Zod schemas for user management validation
 */

import { z } from 'zod';

// ==========================================
// USER ROLES & STATUS SCHEMAS
// ==========================================

export const userRoleSchema = z.enum(['god', 'user', 'admin', 'staff'] as const);

export const userStatusSchema = z.enum(['active', 'inactive', 'suspended', 'pending'] as const);

// ==========================================
// CREATE USER SCHEMAS
// ==========================================

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim(),
  email: z.string().min(1, 'Email is required').email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  roleId: z.string().min(1, 'Role is required'),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  status: userStatusSchema.default('active'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ==========================================
// UPDATE USER SCHEMAS
// ==========================================

export const updateUserSchema = createUserSchema.partial().omit({
  password: true,
  email: true,
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ==========================================
// UPDATE PROFILE SCHEMAS
// ==========================================

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==========================================
// UPDATE USER PREFERENCES SCHEMAS
// ==========================================

export const updateUserPreferencesSchema = z.object({
  language: z.string().min(2, 'Language must be at least 2 characters').optional(),
  timezone: z.string().min(1, 'Timezone is required').optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;

// ==========================================
// USER FILTER SCHEMAS
// ==========================================

export const userFilterSchema = z.object({
  role: z.string().optional(),
  status: userStatusSchema.optional(),
  emailVerified: z.boolean().optional(),
  search: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type UserFilterInput = z.infer<typeof userFilterSchema>;

// ==========================================
// BULK OPERATION SCHEMAS
// ==========================================

export const bulkDeleteUsersSchema = z.object({
  userIds: z
    .array(z.string())
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot delete more than 100 users at once'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason must not exceed 500 characters'),
});

export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>;

export const bulkUpdateUsersSchema = z.object({
  userIds: z
    .array(z.string())
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot update more than 100 users at once'),
  updates: z.object({
    status: userStatusSchema.optional(),
    roleId: z.string().optional(),
    customPermissions: z.array(z.string()).optional(),
  }),
});

export type BulkUpdateUsersInput = z.infer<typeof bulkUpdateUsersSchema>;

// ==========================================
// USER PROFILE SCHEMAS
// ==========================================

export const userProfileSchema = z.object({
  bio: z.string().max(1000, 'Bio must not exceed 1000 characters').optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      website: z.string().url('Invalid website URL').optional(),
      linkedin: z.string().url('Invalid LinkedIn URL').optional(),
      twitter: z.string().url('Invalid Twitter URL').optional(),
      github: z.string().url('Invalid GitHub URL').optional(),
    })
    .optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;
