/**
 * Wallet Validation Schemas
 * Validation logic for wallet transactions
 */

import { z } from 'zod';

export const rechargeSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    paymentMethod: z.string().min(1, 'Payment method required')
});

export const transferSchema = z.object({
    recipientEmail: z.string().email('Invalid email address'),
    amount: z.number().positive('Amount must be positive')
});

export const withdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    bankDetails: z.record(z.string(), z.unknown()).refine(
        (data) => Object.keys(data).length > 0,
        'Bank details required'
    )
});

export const billPaymentSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    billDetails: z.record(z.string(), z.unknown()).refine(
        (data) => Object.keys(data).length > 0,
        'Bill details required'
    )
});
