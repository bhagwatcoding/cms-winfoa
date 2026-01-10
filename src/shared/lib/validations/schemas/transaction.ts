/**
 * Transaction Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ==========================================
// TRANSACTION ENUMS
// ==========================================

export const transactionTypeSchema = z.enum(['credit', 'debit']);
export const transactionStatusSchema = z.enum(['completed', 'pending', 'failed']);

// ==========================================
// CREATE TRANSACTION SCHEMA
// ==========================================

export const createTransactionSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    centerId: z.string().min(1, 'Center ID is required'),
    type: transactionTypeSchema,
    amount: z.number().positive('Amount must be positive'),
    description: z.string().min(1, 'Description is required'),
    paymentMethod: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

// ==========================================
// UPDATE TRANSACTION SCHEMA
// ==========================================

// Transactions usually shouldn't be updated loosely, but for status updates:
export const updateTransactionSchema = z.object({
    status: transactionStatusSchema.optional(),
    metadata: z.record(z.unknown()).optional(),
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
