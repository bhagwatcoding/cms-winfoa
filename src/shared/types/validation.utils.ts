/**
 * Validation Utilities
 * Common validation functions and utilities used across the application
 */

import { z } from 'zod';
import type { ValidationResult, ValidationError } from './base.types';

// ==========================================
// CORE VALIDATION FUNCTIONS
// ==========================================

/**
 * Validate data against a Zod schema
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
  }));

  return { success: false, errors };
}

/**
 * Validate data against a Zod schema asynchronously
 */
export async function validateSchemaAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  const result = await schema.safeParseAsync(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
    code: error.code,
  }));

  return { success: false, errors };
}

/**
 * Safe parse with default value fallback
 */
export function safeParseWithDefault<T>(schema: z.ZodSchema<T>, data: unknown, defaultValue: T): T {
  const result = schema.safeParse(data);
  return result.success ? result.data : defaultValue;
}

/**
 * Create a validator function from a schema
 */
export function createValidator<T>(schema: z.ZodSchema<T>): (data: unknown) => ValidationResult<T> {
  return (data: unknown) => validateSchema(schema, data);
}

// ==========================================
// ERROR HANDLING UTILITIES
// ==========================================

/**
 * Get first validation error message
 */
export function getFirstErrorMessage(errors: ValidationError[]): string {
  return errors[0]?.message || 'Validation failed';
}

/**
 * Group validation errors by field
 */
export function groupErrorsByField(errors: ValidationError[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  errors.forEach((error) => {
    if (!grouped[error.field]) {
      grouped[error.field] = [];
    }
    grouped[error.field]!.push(error.message);
  });

  return grouped;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0]!.message;

  return errors.map((error) => `${error.field}: ${error.message}`).join(', ');
}

/**
 * Check if a specific field has validation errors
 */
export function hasFieldError(errors: ValidationError[], field: string): boolean {
  return errors.some((error) => error.field === field);
}

/**
 * Get validation errors for a specific field
 */
export function getFieldErrors(errors: ValidationError[], field: string): string[] {
  return errors.filter((error) => error.field === field).map((error) => error.message);
}

// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================

/**
 * Middleware-style validation wrapper
 */
export async function withValidation<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<ValidationResult<T>> {
  return validateSchemaAsync(schema, data);
}

/**
 * Validate or throw an error
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((error) => `${error.path.join('.')}: ${error.message}`)
      .join(', ');
    throw new Error(`Validation failed: ${errorMessage}`);
  }

  return result.data;
}

/**
 * Validate or throw an error asynchronously
 */
export async function validateOrThrowAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((error) => `${error.path.join('.')}: ${error.message}`)
      .join(', ');
    throw new Error(`Validation failed: ${errorMessage}`);
  }

  return result.data;
}

// ==========================================
// COMMON VALIDATION SCHEMAS
// ==========================================

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase()
  .trim();

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

/**
 * Phone validation schema
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .optional()
  .or(z.literal(''));

/**
 * URL validation schema
 */
export const urlSchema = z.string().url('Invalid URL format').optional().or(z.literal(''));

/**
 * Object ID validation schema
 */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

// ==========================================
// EXPORT TYPES
// ==========================================

export type EmailInput = z.infer<typeof emailSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
export type UrlInput = z.infer<typeof urlSchema>;
export type ObjectIdInput = z.infer<typeof objectIdSchema>;
