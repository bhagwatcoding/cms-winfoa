/**
 * Admin Validation Schemas
 * All Zod schemas for admin operations and management
 */

import { z } from 'zod';

// ==========================================
// ADMIN USER MANAGEMENT SCHEMAS
// ==========================================

export const adminCreateUserSchema = z.object({
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
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  roleId: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).default('active'),
  sendWelcomeEmail: z.boolean().default(true),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;

// ==========================================
// ADMIN USER UPDATE SCHEMAS
// ==========================================

export const adminUpdateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  roleId: z.string().min(1, 'Role is required').optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  emailVerified: z.boolean().optional(),
  accountLocked: z.boolean().optional(),
  requirePasswordChange: z.boolean().optional(),
  customPermissions: z.array(z.string()).max(50, 'Too many custom permissions').optional(),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;

// ==========================================
// BULK OPERATION SCHEMAS
// ==========================================

export const adminBulkUserActionSchema = z.object({
  userIds: z
    .array(z.string())
    .min(1, 'At least one user ID is required')
    .max(100, 'Cannot process more than 100 users at once'),
  action: z.enum(['activate', 'deactivate', 'suspend', 'delete', 'send-email']),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason must not exceed 500 characters'),
  notifyUsers: z.boolean().default(true),
});

export type AdminBulkUserActionInput = z.infer<typeof adminBulkUserActionSchema>;

// ==========================================
// SYSTEM CONFIGURATION SCHEMAS
// ==========================================

export const systemConfigSchema = z.object({
  siteName: z
    .string()
    .min(1, 'Site name is required')
    .max(100, 'Site name must not exceed 100 characters'),
  siteDescription: z
    .string()
    .max(500, 'Site description must not exceed 500 characters')
    .optional(),
  maintenanceMode: z.boolean().default(false),
  allowRegistration: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(true),
  sessionTimeout: z
    .number()
    .min(5, 'Session timeout must be at least 5 minutes')
    .max(1440, 'Session timeout must not exceed 24 hours')
    .default(60),
  passwordExpiryDays: z
    .number()
    .min(0, 'Password expiry days cannot be negative')
    .max(365, 'Password expiry must not exceed 365 days')
    .default(90),
});

export type SystemConfigInput = z.infer<typeof systemConfigSchema>;

// ==========================================
// ADMIN SEARCH & FILTER SCHEMAS
// ==========================================

export const adminUserFilterSchema = z.object({
  search: z.string().max(100, 'Search query too long').optional(),
  role: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).optional(),
  emailVerified: z.boolean().optional(),
  accountLocked: z.boolean().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  lastLoginFrom: z.date().optional(),
  lastLoginTo: z.date().optional(),
  sortBy: z.enum(['createdAt', 'lastLoginAt', 'email', 'name', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .default(20),
});

export type AdminUserFilterInput = z.infer<typeof adminUserFilterSchema>;

// ==========================================
// AUDIT LOG SCHEMAS
// ==========================================

export const auditLogFilterSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  resourceType: z.string().optional(),
  status: z.enum(['success', 'failed', 'pending']).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  ipAddress: z.string().optional(),
  limit: z.number().min(1).max(1000).default(100),
});

export type AuditLogFilterInput = z.infer<typeof auditLogFilterSchema>;
