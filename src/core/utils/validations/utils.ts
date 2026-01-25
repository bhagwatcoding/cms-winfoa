/**
 * Validation Utilities
 * Common validation helper functions
 */

import { VALIDATION } from '@/config';
import { z } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
}

/**
 * Validate data against a Zod schema
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const parsed = schema.parse(data);
    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    };
  }
}

/**
 * Safe validate - returns result without throwing
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  return result;
}

/**
 * Check if value is a valid ObjectId string
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION.REGEX.EMAIL.test(email);
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}
