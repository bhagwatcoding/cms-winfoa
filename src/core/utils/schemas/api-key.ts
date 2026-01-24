/**
 * API Key Schema Definitions
 * Zod schemas for API key validation
 */

import { z } from 'zod';

export const createApiKeySchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    environment: z.enum(['live', 'test']).default('test'),
    scopes: z.array(z.enum(['read', 'write', 'delete', 'admin'])).default(['read']),
    permissions: z.array(z.string()).optional(),
    rateLimit: z.number().min(1).max(10000).default(100),
    dailyLimit: z.number().min(1).optional(),
    allowedIps: z.array(z.string()).optional(),
    allowedDomains: z.array(z.string()).optional(),
    expiresAt: z.date().optional(),
});

export const updateApiKeySchema = createApiKeySchema.partial();
