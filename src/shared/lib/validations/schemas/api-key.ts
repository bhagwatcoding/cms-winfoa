/**
 * API Key Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// CREATE API KEY SCHEMA
// ==========================================

export const createApiKeySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    permissions: z.array(z.string()).min(1, 'At least one permission is required'),
    rateLimit: z.number().int().positive().optional(),
    expiresAt: z.string().or(z.date()).transform((date) => new Date(date)).optional(),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

// ==========================================
// UPDATE API KEY SCHEMA
// ==========================================

export const updateApiKeySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
    permissions: z.array(z.string()).min(1, 'At least one permission is required').optional(),
    rateLimit: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
    expiresAt: z.string().or(z.date()).transform((date) => new Date(date)).optional().or(z.null()),
});

export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;
