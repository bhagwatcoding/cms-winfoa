/**
 * Validation Utilities
 * Helper functions for Zod schema validation
 */

import { z } from 'zod';

// ==========================================
// TYPES
// ==========================================

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
}

// ==========================================
// VALIDATION HELPERS
// ==========================================

/**
 * Validate data against a Zod schema (synchronous)
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with data or errors
 * 
 * @example
 * const result = validateSchema(loginSchema, formData);
 * if (result.success) {
 *   // Use result.data
 * } else {
 *   // Display result.errors
 * }
 */
export function validateSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): ValidationResult<T> {
    try {
        const validated = schema.parse(data);
        return {
            success: true,
            data: validated,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: ValidationError[] = error.issues.map((err: z.ZodIssue) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                errors,
            };
        }

        return {
            success: false,
            errors: [{ field: 'unknown', message: 'Validation failed' }],
        };
    }
}

/**
 * Validate data against a Zod schema (asynchronous)
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Promise of validation result
 * 
 * @example
 * const result = await validateSchemaAsync(signupSchema, formData);
 * if (result.success) {
 *   // Use result.data
 * }
 */
export async function validateSchemaAsync<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<ValidationResult<T>> {
    try {
        const validated = await schema.parseAsync(data);
        return {
            success: true,
            data: validated,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: ValidationError[] = error.issues.map((err: z.ZodIssue) => ({
                field: err.path.join('.'),
                message: err.message,
            }));

            return {
                success: false,
                errors,
            };
        }

        return {
            success: false,
            errors: [{ field: 'unknown', message: 'Validation failed' }],
        };
    }
}

/**
 * Safe parse with default value
 * 
 * @param schema - Zod schema
 * @param data - Data to parse
 * @param defaultValue - Default value if validation fails
 * @returns Validated data or default value
 */
export function safeParseWithDefault<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    defaultValue: T
): T {
    const result = schema.safeParse(data);
    return result.success ? result.data : defaultValue;
}

/**
 * Extract first error message from validation errors
 * 
 * @param errors - Array of validation errors
 * @returns First error message or generic message
 */
export function getFirstErrorMessage(errors?: ValidationError[]): string {
    if (!errors || errors.length === 0) {
        return 'Validation failed';
    }
    return errors[0].message;
}

/**
 * Group validation errors by field
 * 
 * @param errors - Array of validation errors
 * @returns Object with field names as keys and error messages as values
 */
export function groupErrorsByField(
    errors?: ValidationError[]
): Record<string, string[]> {
    if (!errors) return {};

    return errors.reduce((acc, error) => {
        if (!acc[error.field]) {
            acc[error.field] = [];
        }
        acc[error.field].push(error.message);
        return acc;
    }, {} as Record<string, string[]>);
}

/**
 * Format validation errors for display
 * 
 * @param errors - Array of validation errors
 * @returns Formatted error string
 */
export function formatValidationErrors(errors?: ValidationError[]): string {
    if (!errors || errors.length === 0) {
        return 'Validation failed';
    }

    return errors.map((error) => `${error.field}: ${error.message}`).join(', ');
}

/**
 * Check if a field has errors
 * 
 * @param errors - Array of validation errors
 * @param fieldName - Field name to check
 * @returns True if field has errors
 */
export function hasFieldError(
    errors: ValidationError[] | undefined,
    fieldName: string
): boolean {
    if (!errors) return false;
    return errors.some((error) => error.field === fieldName);
}

/**
 * Get errors for a specific field
 * 
 * @param errors - Array of validation errors
 * @param fieldName - Field name to get errors for
 * @returns Array of error messages for the field
 */
export function getFieldErrors(
    errors: ValidationError[] | undefined,
    fieldName: string
): string[] {
    if (!errors) return [];
    return errors
        .filter((error) => error.field === fieldName)
        .map((error) => error.message);
}

/**
 * Get first error for a specific field
 * 
 * @param errors - Array of validation errors
 * @param fieldName - Field name to get error for
 * @returns First error message for the field or undefined
 */
export function getFirstFieldError(
    errors: ValidationError[] | undefined,
    fieldName: string
): string | undefined {
    const fieldErrors = getFieldErrors(errors, fieldName);
    return fieldErrors.length > 0 ? fieldErrors[0] : undefined;
}

// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================

/**
 * Create a validation middleware for server actions
 * 
 * @param schema - Zod schema to validate against
 * @returns Validation middleware function
 * 
 * @example
 * export async function createUser(data: unknown) {
 *   const validated = await withValidation(createUserSchema, data);
 *   if (!validated.success) {
 *     return { success: false, errors: validated.errors };
 *   }
 *   // Use validated.data
 * }
 */
export async function withValidation<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<ValidationResult<T>> {
    return validateSchemaAsync(schema, data);
}

/**
 * Validate and throw on error (for use in try-catch blocks)
 * 
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validated data
 * @throws ZodError if validation fails
 */
export function validateOrThrow<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): T {
    return schema.parse(data);
}

/**
 * Create a type-safe validator function
 * 
 * @param schema - Zod schema
 * @returns Validator function
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
    return (data: unknown): ValidationResult<T> => {
        return validateSchema(schema, data);
    };
}
