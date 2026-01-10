/**
 * Admit Card Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// ADMIT CARD ENUMS
// ==========================================

export const admitCardStatusSchema = z.enum(['available', 'pending', 'not-eligible']);

// ==========================================
// CREATE ADMIT CARD SCHEMA
// ==========================================

export const createAdmitCardSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    centerId: z.string().min(1, 'Center ID is required'),
    courseId: z.string().min(1, 'Course ID is required'),
    studentName: z.string().min(1, 'Student name is required'),
    enrollmentId: z.string().min(1, 'Enrollment ID is required'),
    rollNumber: z.string().min(1, 'Roll number is required'),
    courseName: z.string().min(1, 'Course name is required'),
    examDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date)),
    examTime: z.string().min(1, 'Exam time is required'),
    examCenter: z.string().min(1, 'Exam center is required'),
    examCenterAddress: z.string().min(1, 'Exam center address is required'),
    status: admitCardStatusSchema.default('pending').optional(),
    admitCardUrl: z.string().url().optional().or(z.literal('')),
    metadata: z.record(z.unknown()).optional(),
});

export type CreateAdmitCardInput = z.infer<typeof createAdmitCardSchema>;

// ==========================================
// UPDATE ADMIT CARD SCHEMA
// ==========================================

export const updateAdmitCardSchema = z.object({
    studentName: z.string().optional(),
    enrollmentId: z.string().optional(),
    rollNumber: z.string().optional(),
    courseName: z.string().optional(),
    examDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    examTime: z.string().optional(),
    examCenter: z.string().optional(),
    examCenterAddress: z.string().optional(),
    status: admitCardStatusSchema.optional(),
    admitCardUrl: z.string().url().optional().or(z.literal('')),
    metadata: z.record(z.unknown()).optional(),
});

export type UpdateAdmitCardInput = z.infer<typeof updateAdmitCardSchema>;
