/**
 * Certificate Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// CERTIFICATE ENUMS
// ==========================================

export const certificateStatusSchema = z.enum(['pending', 'issued', 'revoked']);

// ==========================================
// CREATE CERTIFICATE SCHEMA
// ==========================================

export const createCertificateSchema = z.object({
    certificateNumber: z
        .string()
        .min(1, 'Certificate number is required')
        .regex(/^[A-Z0-9-]+$/, 'Certificate number must contain only uppercase letters, numbers, and hyphens')
        .max(50, 'Certificate number must not exceed 50 characters'),
    studentId: z
        .string()
        .min(1, 'Student is required'),
    courseId: z
        .string()
        .min(1, 'Course is required'),
    centerId: z
        .string()
        .min(1, 'Center is required'),
    issueDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date)),
    status: certificateStatusSchema.default('pending').optional(),
    grade: z
        .string()
        .regex(/^[A-F][+-]?$/, 'Invalid grade format (e.g., A+, B, C-)')
        .optional(),
    marks: z
        .number()
        .min(0, 'Marks cannot be negative')
        .max(100, 'Marks cannot exceed 100')
        .optional(),
    remarks: z
        .string()
        .max(500, 'Remarks must not exceed 500 characters')
        .optional(),
});

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;

// ==========================================
// UPDATE CERTIFICATE SCHEMA
// ==========================================

export const updateCertificateSchema = z.object({
    certificateNumber: z
        .string()
        .regex(/^[A-Z0-9-]+$/, 'Certificate number must contain only uppercase letters, numbers, and hyphens')
        .max(50, 'Certificate number must not exceed 50 characters')
        .optional(),
    issueDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    status: certificateStatusSchema.optional(),
    grade: z
        .string()
        .regex(/^[A-F][+-]?$/, 'Invalid grade format (e.g., A+, B, C-)')
        .optional(),
    marks: z
        .number()
        .min(0, 'Marks cannot be negative')
        .max(100, 'Marks cannot exceed 100')
        .optional(),
    remarks: z
        .string()
        .max(500, 'Remarks must not exceed 500 characters')
        .optional(),
});

export type UpdateCertificateInput = z.infer<typeof updateCertificateSchema>;

// ==========================================
// CERTIFICATE FILTER SCHEMA
// ==========================================

export const certificateFilterSchema = z.object({
    search: z.string().optional(),
    studentId: z.string().optional(),
    courseId: z.string().optional(),
    centerId: z.string().optional(),
    status: certificateStatusSchema.optional(),
    issueDateFrom: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    issueDateTo: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    page: z.number().int().positive().default(1).optional(),
    limit: z.number().int().positive().max(100).default(10).optional(),
    sortBy: z
        .enum(['certificateNumber', 'issueDate', 'createdAt', 'status'])
        .default('issueDate')
        .optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export type CertificateFilterInput = z.infer<typeof certificateFilterSchema>;

// ==========================================
// ISSUE CERTIFICATE SCHEMA
// ==========================================

export const issueCertificateSchema = z.object({
    studentId: z.string().min(1, 'Student is required'),
    courseId: z.string().min(1, 'Course is required'),
    grade: z
        .string()
        .regex(/^[A-F][+-]?$/, 'Invalid grade format (e.g., A+, B, C-)')
        .optional(),
    marks: z
        .number()
        .min(0, 'Marks cannot be negative')
        .max(100, 'Marks cannot exceed 100')
        .optional(),
    issueDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
});

export type IssueCertificateInput = z.infer<typeof issueCertificateSchema>;

// ==========================================
// REVOKE CERTIFICATE SCHEMA
// ==========================================

export const revokeCertificateSchema = z.object({
    certificateId: z.string().min(1, 'Certificate ID is required'),
    reason: z
        .string()
        .min(10, 'Reason must be at least 10 characters')
        .max(500, 'Reason must not exceed 500 characters'),
});

export type RevokeCertificateInput = z.infer<typeof revokeCertificateSchema>;

// ==========================================
// VERIFY CERTIFICATE SCHEMA
// ==========================================

export const verifyCertificateSchema = z.object({
    certificateNumber: z
        .string()
        .min(1, 'Certificate number is required')
        .regex(/^[A-Z0-9-]+$/, 'Invalid certificate number format'),
});

export type VerifyCertificateInput = z.infer<typeof verifyCertificateSchema>;
