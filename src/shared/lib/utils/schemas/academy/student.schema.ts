/**
 * Student Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// STUDENT ENUMS
// ==========================================

export const studentGenderSchema = z.enum(['male', 'female', 'other']);

export const studentStatusSchema = z.enum(['active', 'completed', 'dropped']);

// ==========================================
// CREATE STUDENT SCHEMA
// ==========================================

export const createStudentSchema = z.object({
    name: z
        .string()
        .min(1, 'Student name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    fatherName: z
        .string()
        .min(1, "Father's name is required")
        .min(2, "Father's name must be at least 2 characters")
        .max(100, "Father's name must not exceed 100 characters")
        .trim(),
    motherName: z
        .string()
        .min(1, "Mother's name is required")
        .min(2, "Mother's name must be at least 2 characters")
        .max(100, "Mother's name must not exceed 100 characters")
        .trim(),
    dob: z
        .string()
        .or(z.date())
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 5 && age <= 100;
        }, 'Student must be between 5 and 100 years old')
        .transform((date) => new Date(date)),
    gender: studentGenderSchema,
    centerId: z
        .string()
        .min(1, 'Center is required'),
    courseId: z
        .string()
        .min(1, 'Course is required'),
    admissionDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    profileImage: z
        .string()
        .url('Invalid image URL')
        .optional()
        .or(z.literal('')),
    status: studentStatusSchema.default('active').optional(),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal('')),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    address: z
        .string()
        .max(500, 'Address must not exceed 500 characters')
        .optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

// ==========================================
// UPDATE STUDENT SCHEMA
// ==========================================

export const updateStudentSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
        .optional(),
    fatherName: z
        .string()
        .min(2, "Father's name must be at least 2 characters")
        .max(100, "Father's name must not exceed 100 characters")
        .trim()
        .optional(),
    motherName: z
        .string()
        .min(2, "Mother's name must be at least 2 characters")
        .max(100, "Mother's name must not exceed 100 characters")
        .trim()
        .optional(),
    dob: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    gender: studentGenderSchema.optional(),
    centerId: z.string().optional(),
    courseId: z.string().optional(),
    admissionDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    profileImage: z
        .string()
        .url('Invalid image URL')
        .optional()
        .or(z.literal('')),
    status: studentStatusSchema.optional(),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal('')),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional()
        .or(z.literal('')),
    address: z
        .string()
        .max(500, 'Address must not exceed 500 characters')
        .optional(),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

// ==========================================
// STUDENT FILTER SCHEMA
// ==========================================

export const studentFilterSchema = z.object({
    search: z.string().optional(),
    centerId: z.string().optional(),
    courseId: z.string().optional(),
    status: studentStatusSchema.optional(),
    gender: studentGenderSchema.optional(),
    admissionDateFrom: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    admissionDateTo: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    page: z.number().int().positive().default(1).optional(),
    limit: z.number().int().positive().max(100).default(10).optional(),
    sortBy: z
        .enum(['name', 'admissionDate', 'createdAt', 'status'])
        .default('admissionDate')
        .optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export type StudentFilterInput = z.infer<typeof studentFilterSchema>;

// ==========================================
// BULK STUDENT OPERATIONS
// ==========================================

export const bulkDeleteStudentsSchema = z.object({
    studentIds: z
        .array(z.string())
        .min(1, 'At least one student ID is required')
        .max(100, 'Cannot delete more than 100 students at once'),
});

export type BulkDeleteStudentsInput = z.infer<typeof bulkDeleteStudentsSchema>;

export const bulkUpdateStudentsSchema = z.object({
    studentIds: z
        .array(z.string())
        .min(1, 'At least one student ID is required')
        .max(100, 'Cannot update more than 100 students at once'),
    updates: z.object({
        status: studentStatusSchema.optional(),
        centerId: z.string().optional(),
        courseId: z.string().optional(),
    }),
});

export type BulkUpdateStudentsInput = z.infer<typeof bulkUpdateStudentsSchema>;

// ==========================================
// STUDENT ENROLLMENT SCHEMA
// ==========================================

export const enrollStudentSchema = z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    courseId: z.string().min(1, 'Course ID is required'),
    enrollmentDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
});

export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;
