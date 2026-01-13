/**
 * Employee Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// EMPLOYEE ENUMS
// ==========================================

export const employeeStatusSchema = z.enum(['active', 'inactive', 'on-leave']);

// ==========================================
// CREATE EMPLOYEE SCHEMA
// ==========================================

export const createEmployeeSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    role: z
        .string()
        .min(1, 'Role is required')
        .trim(),
    designation: z
        .string()
        .min(1, 'Designation is required')
        .trim(),
    department: z
        .string()
        .min(1, 'Department is required')
        .trim(),
    salary: z
        .number()
        .positive('Salary must be positive')
        .optional(),
    joiningDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    profileImage: z
        .string()
        .url('Invalid image URL')
        .optional()
        .or(z.literal('')),
    status: employeeStatusSchema.default('active').optional(),
    address: z
        .string()
        .max(500, 'Address must not exceed 500 characters')
        .optional(),
    centerId: z
        .string()
        .min(1, 'Center is required'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

// ==========================================
// UPDATE EMPLOYEE SCHEMA
// ==========================================

export const updateEmployeeSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim()
        .optional(),
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .optional(),
    role: z.string().trim().optional(),
    designation: z.string().trim().optional(),
    department: z.string().trim().optional(),
    salary: z.number().positive().optional(),
    joiningDate: z
        .string()
        .or(z.date())
        .transform((date) => new Date(date))
        .optional(),
    profileImage: z
        .string()
        .url('Invalid image URL')
        .optional()
        .or(z.literal('')),
    status: employeeStatusSchema.optional(),
    address: z
        .string()
        .max(500, 'Address must not exceed 500 characters')
        .optional(),
    centerId: z.string().optional(),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
