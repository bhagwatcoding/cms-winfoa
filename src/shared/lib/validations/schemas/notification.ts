/**
 * Notification Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// NOTIFICATION ENUMS
// ==========================================

export const notificationTypeSchema = z.enum(['info', 'success', 'warning', 'error']);

// ==========================================
// CREATE NOTIFICATION SCHEMA
// ==========================================

export const createNotificationSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    centerId: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    type: notificationTypeSchema.default('info').optional(),
    link: z.string().url().optional().or(z.literal('')),
    metadata: z.record(z.unknown()).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

// ==========================================
// UPDATE NOTIFICATION SCHEMA
// ==========================================

export const updateNotificationSchema = z.object({
    read: z.boolean().optional(),
});

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
