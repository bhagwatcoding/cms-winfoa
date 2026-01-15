/**
 * Admin Schemas
 * Zod validation schemas for admin operations
 */

import { z } from 'zod';

// ==========================================
// REGISTER USER SCHEMA (Admin)
// ==========================================

export const registerUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.string().optional().default('user'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
