/**
 * Admin Validation Schemas
 * Zod schemas for admin-related operations
 */

import { z } from 'zod';

export const createUserRegistrySchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).default('active'),
  metadata: z
    .object({
      subdomain: z.string().optional(),
      source: z.string().optional(),
    })
    .optional(),
});

export const updateUserRegistrySchema = createUserRegistrySchema.partial();
