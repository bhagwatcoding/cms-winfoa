/**
 * Wallet Validation Schemas
 * All Zod schemas for wallet and financial operations
 */

import { z } from 'zod';

// ==========================================
// RECHARGE SCHEMAS
// ==========================================

export const rechargeSchema = z.object({
    amount: z
        .number()
        .positive('Amount must be positive')
        .min(1, 'Minimum recharge amount is 1')
        .max(100000, 'Maximum recharge amount is 100,000'),
    paymentMethod: z
        .string()
        .min(1, 'Payment method is required'),
    paymentDetails: z
        .object({})
        .optional(),
});

export type RechargeInput = z.infer<typeof rechargeSchema>;

// ==========================================
// TRANSFER SCHEMAS
// ==========================================

export const transferSchema = z.object({
    recipientEmail: z
        .string()
        .min(1, 'Recipient email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),
    amount: z
        .number()
        .positive('Amount must be positive')
        .min(1, 'Minimum transfer amount is 1')
        .max(50000, 'Maximum transfer amount is 50,000'),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .optional(),
});

export type TransferInput = z.infer<typeof transferSchema>;

// ==========================================
// WITHDRAWAL SCHEMAS
// ==========================================

export const withdrawalSchema = z.object({
    amount: z
        .number()
        .positive('Amount must be positive')
        .min(10, 'Minimum withdrawal amount is 10')
        .max(25000, 'Maximum withdrawal amount is 25,000'),
    bankAccountId: z
        .string()
        .min(1, 'Bank account is required'),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .optional(),
});

export type WithdrawalInput = z.infer<typeof withdrawalSchema>;

// ==========================================
// TRANSACTION SCHEMAS
// ==========================================

export const transactionTypeSchema = z.enum([
    'credit',
    'debit',
    'transfer',
    'recharge',
    'withdrawal',
    'refund',
    'fee',
    'commission'
]);

export const transactionStatusSchema = z.enum([
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded'
]);

export const createTransactionSchema = z.object({
    type: transactionTypeSchema,
    amount: z
        .number()
        .positive('Amount must be positive'),
    description: z
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .optional(),
    metadata: z
        .object({})
        .optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = z.object({
    status: transactionStatusSchema.optional(),
    description: z
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .optional(),
    metadata: z
        .object({})
        .optional(),
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

// ==========================================
// BANK ACCOUNT SCHEMAS
// ==========================================

export const bankAccountSchema = z.object({
    accountNumber: z
        .string()
        .min(8, 'Account number must be at least 8 digits')
        .max(20, 'Account number must not exceed 20 digits')
        .regex(/^\d+$/, 'Account number must contain only digits'),
    accountHolderName: z
        .string()
        .min(2, 'Account holder name must be at least 2 characters')
        .max(100, 'Account holder name must not exceed 100 characters')
        .trim(),
    bankName: z
        .string()
        .min(2, 'Bank name must be at least 2 characters')
        .max(100, 'Bank name must not exceed 100 characters')
        .trim(),
    ifscCode: z
        .string()
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    branchName: z
        .string()
        .max(100, 'Branch name must not exceed 100 characters')
        .optional(),
});

export type BankAccountInput = z.infer<typeof bankAccountSchema>;

// ==========================================
// WALLET FILTER SCHEMAS
// ==========================================

export const walletTransactionFilterSchema = z.object({
    type: z.array(transactionTypeSchema).optional(),
    status: z.array(transactionStatusSchema).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    minAmount: z.number().positive().optional(),
    maxAmount: z.number().positive().optional(),
});

export type WalletTransactionFilterInput = z.infer<typeof walletTransactionFilterSchema>;