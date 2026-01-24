/**
 * Notification Validation Schemas
 * All Zod schemas for notification operations
 */

import { z } from 'zod';

// ==========================================
// NOTIFICATION TYPE SCHEMAS
// ==========================================

export const notificationTypeSchema = z.enum([
    'info',
    'success',
    'warning',
    'error',
    'system',
    'marketing',
    'transaction',
    'security'
]);

export const notificationChannelSchema = z.enum([
    'email',
    'push',
    'sms',
    'in_app',
    'webhook'
]);

export const notificationStatusSchema = z.enum([
    'pending',
    'sent',
    'delivered',
    'failed',
    'read',
    'clicked'
]);

// ==========================================
// CREATE NOTIFICATION SCHEMAS
// ==========================================

export const createNotificationSchema = z.object({
    userId: z
        .string()
        .min(1, 'User ID is required'),
    type: notificationTypeSchema,
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must not exceed 100 characters'),
    message: z
        .string()
        .min(1, 'Message is required')
        .max(1000, 'Message must not exceed 1000 characters'),
    channels: z
        .array(notificationChannelSchema)
        .min(1, 'At least one channel is required')
        .max(4, 'Maximum 4 channels allowed'),
    priority: z
        .enum(['low', 'medium', 'high', 'urgent'])
        .default('medium'),
    data: z
        .object({})
        .optional(),
    scheduledFor: z
        .date()
        .optional(),
    expiresAt: z
        .date()
        .optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

// ==========================================
// UPDATE NOTIFICATION SCHEMAS
// ==========================================

export const updateNotificationSchema = z.object({
    status: notificationStatusSchema.optional(),
    readAt: z
        .date()
        .optional(),
    clickedAt: z
        .date()
        .optional(),
    metadata: z
        .object({})
        .optional(),
});

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;

// ==========================================
// NOTIFICATION PREFERENCE SCHEMAS
// ==========================================

export const notificationPreferenceSchema = z.object({
    email: z.object({
        loginAlerts: z.boolean().default(true),
        passwordChanges: z.boolean().default(true),
        securityAlerts: z.boolean().default(true),
        transactionAlerts: z.boolean().default(true),
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
    inApp: z.object({
        systemNotifications: z.boolean().default(true),
        transactionUpdates: z.boolean().default(true),
        securityAlerts: z.boolean().default(true),
        marketingMessages: z.boolean().default(false),
    }),
});

export type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>;

// ==========================================
// BULK NOTIFICATION SCHEMAS
// ==========================================

export const bulkNotificationSchema = z.object({
    userIds: z
        .array(z.string())
        .min(1, 'At least one user ID is required')
        .max(1000, 'Cannot send to more than 1000 users at once'),
    type: notificationTypeSchema,
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title must not exceed 100 characters'),
    message: z
        .string()
        .min(1, 'Message is required')
        .max(1000, 'Message must not exceed 1000 characters'),
    channels: z
        .array(notificationChannelSchema)
        .min(1, 'At least one channel is required')
        .max(4, 'Maximum 4 channels allowed'),
    priority: z
        .enum(['low', 'medium', 'high', 'urgent'])
        .default('medium'),
    data: z
        .object({})
        .optional(),
    scheduledFor: z
        .date()
        .optional(),
    expiresAt: z
        .date()
        .optional(),
    sendInBatches: z
        .boolean()
        .default(true),
    batchSize: z
        .number()
        .min(10, 'Batch size must be at least 10')
        .max(100, 'Batch size must not exceed 100')
        .default(50),
});

export type BulkNotificationInput = z.infer<typeof bulkNotificationSchema>;

// ==========================================
// NOTIFICATION FILTER SCHEMAS
// ==========================================

export const notificationFilterSchema = z.object({
    userId: z
        .string()
        .optional(),
    type: z
        .array(notificationTypeSchema)
        .max(8, 'Too many notification types')
        .optional(),
    status: z
        .array(notificationStatusSchema)
        .max(6, 'Too many status filters')
        .optional(),
    channel: z
        .array(notificationChannelSchema)
        .max(4, 'Too many channel filters')
        .optional(),
    priority: z
        .enum(['low', 'medium', 'high', 'urgent'])
        .optional(),
    dateFrom: z
        .date()
        .optional(),
    dateTo: z
        .date()
        .optional(),
    isRead: z
        .boolean()
        .optional(),
    limit: z
        .number()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must not exceed 100')
        .default(20),
});

export type NotificationFilterInput = z.infer<typeof notificationFilterSchema>;