// ==========================================
// ERROR HELPERS
// ==========================================

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof Error && error.name === 'ValidationError';
}

/**
 * Create standard error response
 */
export function createErrorResponse(message: string, code?: string) {
  return {
    success: false as const,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create standard success response
 */
export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true as const,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}
