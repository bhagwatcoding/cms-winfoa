/**
 * Professional API Response Helper
 * Standardized response generation for consistent API contracts
 *
 * @module ApiHelper
 */

import { NextResponse } from 'next/server';
import { ApiResponse, PaginationMeta, PaginatedResponse } from '@/shared/types/api/responses';

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// =============================================================================
// API HELPER CLASS
// =============================================================================

export class ApiHelper {
  /**
   * Success Response (200 OK)
   */
  static success<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status: HttpStatus.OK }
    );
  }

  /**
   * Created Response (201 Created)
   */
  static created<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status: HttpStatus.CREATED }
    );
  }

  /**
   * Paginated Response (200 OK)
   */
  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message?: string
  ): NextResponse<PaginatedResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        data,
        pagination,
        message,
      },
      { status: HttpStatus.OK }
    );
  }

  /**
   * Error Response
   */
  static error(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    code?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors?: any[]
  ): NextResponse<ApiResponse<null>> {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code,
        errors,
      },
      { status }
    );
  }

  /**
   * Unauthorized Response (401)
   */
  static unauthorized(message = 'Unauthorized access'): NextResponse<ApiResponse<null>> {
    return this.error(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }

  /**
   * Forbidden Response (403)
   */
  static forbidden(message = 'Access denied'): NextResponse<ApiResponse<null>> {
    return this.error(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }

  /**
   * Not Found Response (404)
   */
  static notFound(message = 'Resource not found'): NextResponse<ApiResponse<null>> {
    return this.error(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }

  /**
   * Validation Error Response (422)
   */
  static validationError(
    errors: unknown[],
    message = 'Validation failed'
  ): NextResponse<ApiResponse<null>> {
    return this.error(message, HttpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', errors);
  }

  /**
   * Internal Server Error (500)
   */
  static serverError(error: unknown): NextResponse<ApiResponse<null>> {
    console.error('❌ [API] Server Error:', error);

    // In production, don't leak error details
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error instanceof Error
          ? error.message
          : 'Unknown error';

    return this.error(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
  }
}
