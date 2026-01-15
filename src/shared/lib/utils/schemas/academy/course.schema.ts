/**
 * Course Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// CREATE COURSE SCHEMA
// ==========================================

export const createCourseSchema = z.object({
    name: z
        .string()
        .min(1, 'Course name is required')
        .min(3, 'Course name must be at least 3 characters')
        .max(200, 'Course name must not exceed 200 characters')
        .trim(),
    description: z
        .string()
        .min(1, 'Course description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters')
        .trim(),
    duration: z
        .number()
        .int('Duration must be a whole number')
        .positive('Duration must be positive')
        .min(1, 'Duration must be at least 1 month')
        .max(60, 'Duration must not exceed 60 months'),
    fees: z
        .number()
        .nonnegative('Fees cannot be negative')
        .max(1000000, 'Fees must not exceed 1,000,000'),
    centerId: z
        .string()
        .min(1, 'Center is required'),
    isActive: z
        .boolean()
        .default(true)
        .optional(),
    syllabus: z
        .string()
        .max(5000, 'Syllabus must not exceed 5000 characters')
        .optional(),
    prerequisites: z
        .string()
        .max(1000, 'Prerequisites must not exceed 1000 characters')
        .optional(),
    capacity: z
        .number()
        .int('Capacity must be a whole number')
        .positive('Capacity must be positive')
        .max(1000, 'Capacity must not exceed 1000')
        .optional(),
    category: z
        .string()
        .max(100, 'Category must not exceed 100 characters')
        .optional(),
    level: z
        .enum(['beginner', 'intermediate', 'advanced'])
        .optional(),
    thumbnail: z
        .string()
        .url('Invalid thumbnail URL')
        .optional()
        .or(z.literal('')),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// ==========================================
// UPDATE COURSE SCHEMA
// ==========================================

export const updateCourseSchema = z.object({
    name: z
        .string()
        .min(3, 'Course name must be at least 3 characters')
        .max(200, 'Course name must not exceed 200 characters')
        .trim()
        .optional(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters')
        .trim()
        .optional(),
    duration: z
        .number()
        .int('Duration must be a whole number')
        .positive('Duration must be positive')
        .min(1, 'Duration must be at least 1 month')
        .max(60, 'Duration must not exceed 60 months')
        .optional(),
    fees: z
        .number()
        .nonnegative('Fees cannot be negative')
        .max(1000000, 'Fees must not exceed 1,000,000')
        .optional(),
    centerId: z.string().optional(),
    isActive: z.boolean().optional(),
    syllabus: z
        .string()
        .max(5000, 'Syllabus must not exceed 5000 characters')
        .optional(),
    prerequisites: z
        .string()
        .max(1000, 'Prerequisites must not exceed 1000 characters')
        .optional(),
    capacity: z
        .number()
        .int('Capacity must be a whole number')
        .positive('Capacity must be positive')
        .max(1000, 'Capacity must not exceed 1000')
        .optional(),
    category: z
        .string()
        .max(100, 'Category must not exceed 100 characters')
        .optional(),
    level: z
        .enum(['beginner', 'intermediate', 'advanced'])
        .optional(),
    thumbnail: z
        .string()
        .url('Invalid thumbnail URL')
        .optional()
        .or(z.literal('')),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;

// ==========================================
// COURSE FILTER SCHEMA
// ==========================================

export const courseFilterSchema = z.object({
    search: z.string().optional(),
    centerId: z.string().optional(),
    category: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    isActive: z.boolean().optional(),
    minDuration: z.number().int().positive().optional(),
    maxDuration: z.number().int().positive().optional(),
    minFees: z.number().nonnegative().optional(),
    maxFees: z.number().nonnegative().optional(),
    page: z.number().int().positive().default(1).optional(),
    limit: z.number().int().positive().max(100).default(10).optional(),
    sortBy: z
        .enum(['name', 'duration', 'fees', 'createdAt'])
        .default('createdAt')
        .optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export type CourseFilterInput = z.infer<typeof courseFilterSchema>;

// ==========================================
// BULK COURSE OPERATIONS
// ==========================================

export const bulkDeleteCoursesSchema = z.object({
    courseIds: z
        .array(z.string())
        .min(1, 'At least one course ID is required')
        .max(100, 'Cannot delete more than 100 courses at once'),
});

export type BulkDeleteCoursesInput = z.infer<typeof bulkDeleteCoursesSchema>;

export const bulkUpdateCoursesSchema = z.object({
    courseIds: z
        .array(z.string())
        .min(1, 'At least one course ID is required')
        .max(100, 'Cannot update more than 100 courses at once'),
    updates: z.object({
        isActive: z.boolean().optional(),
        fees: z.number().nonnegative().optional(),
        centerId: z.string().optional(),
    }),
});

export type BulkUpdateCoursesInput = z.infer<typeof bulkUpdateCoursesSchema>;
