/**
 * Wallet Schemas
 * Zod validation schemas for wallet operations
 */

import { z } from 'zod';

// ==========================================
// RECHARGE SCHEMA
// ==========================================

export const rechargeSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    paymentMethod: z.string().min(1, 'Payment method required')
});

export type RechargeInput = z.infer<typeof rechargeSchema>;

// ==========================================
// TRANSFER SCHEMA
// ==========================================

export const transferSchema = z.object({
    recipientEmail: z.string().email('Invalid email address'),
    amount: z.number().positive('Amount must be positive')
});

export type TransferInput = z.infer<typeof transferSchema>;

// ==========================================
// WITHDRAWAL SCHEMA
// ==========================================

export const withdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    bankDetails: z.record(z.string(), z.unknown()).refine(
        (data) => Object.keys(data).length > 0,
        'Bank details required'
    )
});

export type WithdrawalInput = z.infer<typeof withdrawalSchema>;

// ==========================================
// BILL PAYMENT SCHEMA
// ==========================================

export const billPaymentSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    billDetails: z.record(z.string(), z.unknown()).refine(
        (data) => Object.keys(data).length > 0,
        'Bill details required'
    )
});

export type BillPaymentInput = z.infer<typeof billPaymentSchema>;
