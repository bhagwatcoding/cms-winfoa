/**
 * Account Validation Schemas
 * Validation logic for user account management
 */

import { z } from 'zod';

export const changeEmailSchema = z.object({
    email: z.string().email('Invalid email address')
});

export const accountDeletionSchema = z.object({
    confirmation: z.string()
}).refine((data) => data.confirmation === 'DELETE', {
    message: 'Please type DELETE to confirm',
    path: ['confirmation']
});
