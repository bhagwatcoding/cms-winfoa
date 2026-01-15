/**
 * Admin Validation Schemas
 * Validation logic for administrative actions
 */

import { z } from 'zod';

export const registerUserSchema = z.object({
    email: z.string().email(),
    role: z.string().min(1),
    metadata: z.unknown().optional()
});
