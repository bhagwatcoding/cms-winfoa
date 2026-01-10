/**
 * Result Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// RESULT ENUMS
// ==========================================

export const resultStatusSchema = z.enum(['pass', 'fail', 'pending']);

// ==========================================
// CREATE RESULT SCHEMA
// ==========================================

export const createResultSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    courseId: z.string().min(1, 'Course ID is required'),
    centerId: z.string().min(1, 'Center ID is required'),
    examDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date)),
    marks: z.number().min(0, 'Marks must be non-negative'),
    totalMarks: z.number().positive('Total marks must be positive'),
    grade: z.string().min(1, 'Grade is required'),
    status: resultStatusSchema,
    remarks: z
        .string()
        .max(500, 'Remarks must not exceed 500 characters')
        .optional(),
    percentage: z.number().min(0).max(100).optional(), // Calculated automatically but optionally passable
});

export type CreateResultInput = z.infer<typeof createResultSchema>;

// ==========================================
// UPDATE RESULT SCHEMA
// ==========================================

export const updateResultSchema = z.object({
    studentId: z.string().optional(),
    courseId: z.string().optional(),
    centerId: z.string().optional(),
    examDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    marks: z.number().min(0).optional(),
    totalMarks: z.number().positive().optional(),
    grade: z.string().optional(),
    status: resultStatusSchema.optional(),
    remarks: z
        .string()
        .max(500, 'Remarks must not exceed 500 characters')
        .optional(),
    percentage: z.number().min(0).max(100).optional(),
});

export type UpdateResultInput = z.infer<typeof updateResultSchema>;
