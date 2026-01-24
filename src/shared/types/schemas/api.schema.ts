/**
 * API Validation Schemas
 * All Zod schemas for API operations and data validation
 */

import { z } from 'zod';

// ==========================================
// API KEY SCHEMAS
// ==========================================

export const apiKeyCreateSchema = z.object({
    name: z
        .string()
        .min(1, 'API key name is required')
        .max(50, 'API key name must not exceed 50 characters'),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .optional(),
    scopes: z
        .array(z.string())
        .min(1, 'At least one scope is required')
        .max(20, 'Maximum 20 scopes allowed'),
    expiresAt: z
        .date()
        .optional(),
    isActive: z
        .boolean()
        .default(true),
    rateLimit: z
        .object({
            requests: z.number().min(1).max(10000).default(1000),
            window: z.enum(['minute', 'hour', 'day']).default('hour'),
        })
        .optional(),
});

export type ApiKeyCreateInput = z.infer<typeof apiKeyCreateSchema>;

export const apiKeyUpdateSchema = apiKeyCreateSchema.partial().omit({
    name: true,
});

export type ApiKeyUpdateInput = z.infer<typeof apiKeyUpdateSchema>;

// ==========================================
// PAGINATION SCHEMAS
// ==========================================

export const paginationSchema = z.object({
    page: z
        .number()
        .min(1, 'Page must be at least 1')
        .default(1),
    limit: z
        .number()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must not exceed 100')
        .default(20),
    sortBy: z
        .string()
        .max(50, 'Sort field too long')
        .optional(),
    sortOrder: z
        .enum(['asc', 'desc'])
        .default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// ==========================================
// SEARCH SCHEMAS
// ==========================================

export const searchSchema = paginationSchema.extend({
    search: z
        .string()
        .max(100, 'Search query too long')
        .optional(),
    query: z
        .string()
        .max(100, 'Query too long')
        .optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// ==========================================
// FILTER SCHEMAS
// ==========================================

export const baseFilterSchema = paginationSchema.extend({
    search: z
        .string()
        .max(100, 'Search query too long')
        .optional(),
    status: z
        .string()
        .max(20, 'Status too long')
        .optional(),
    isActive: z
        .boolean()
        .optional(),
    startDate: z
        .date()
        .optional(),
    endDate: z
        .date()
        .optional(),
});

export type BaseFilterInput = z.infer<typeof baseFilterSchema>;

// ==========================================
// DATE RANGE SCHEMAS
// ==========================================

export const dateRangeSchema = z.object({
    startDate: z
        .date()
        .optional(),
    endDate: z
        .date()
        .optional(),
}).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            return data.startDate <= data.endDate;
        }
        return true;
    },
    {
        message: 'End date must be after start date',
        path: ['endDate'],
    }
);

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

// ==========================================
// FILE UPLOAD SCHEMAS
// ==========================================

export const fileUploadSchema = z.object({
    fileName: z
        .string()
        .min(1, 'File name is required')
        .max(255, 'File name too long'),
    fileSize: z
        .number()
        .positive('File size must be positive')
        .max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
    mimeType: z
        .string()
        .regex(/^\w+\/[-+.\w]+$/, 'Invalid MIME type'),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// ==========================================
// BATCH OPERATION SCHEMAS
// ==========================================

export const batchOperationSchema = z.object({
    ids: z
        .array(z.string())
        .min(1, 'At least one ID is required')
        .max(100, 'Cannot process more than 100 items at once'),
    operation: z
        .enum(['delete', 'update', 'activate', 'deactivate']),
    data: z
        .object({})
        .optional(),
    reason: z
        .string()
        .min(1, 'Reason is required')
        .max(500, 'Reason must not exceed 500 characters'),
});

export type BatchOperationInput = z.infer<typeof batchOperationSchema>;

// ==========================================
// EXPORT SCHEMAS
// ==========================================

export const exportDataSchema = z.object({
    format: z
        .enum(['csv', 'json', 'xlsx', 'pdf'])
        .default('csv'),
    fields: z
        .array(z.string())
        .optional(),
    filters: z
        .object({})
        .optional(),
    dateRange: dateRangeSchema.optional(),
});

export type ExportDataInput = z.infer<typeof exportDataSchema>;