/**
 * API Response Types
 * Standardized response types for all API endpoints and server actions
 */

import type { ValidationError } from '@/lib/validations/utils';

// ==========================================
// BASE RESPONSE TYPES
// ==========================================

export interface BaseResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
    success: true;
    data: T;
    message?: string;
}

export interface ErrorResponse extends BaseResponse {
    success: false;
    error: string;
    errors?: ValidationError[];
    code?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// ==========================================
// AUTHENTICATION RESPONSES
// ==========================================

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
}

export interface LoginResponse extends BaseResponse {
    success: boolean;
    redirectUrl?: string;
    user?: AuthUser;
    error?: string;
    errors?: ValidationError[];
}

export interface SignupResponse extends BaseResponse {
    success: boolean;
    redirectUrl?: string;
    user?: AuthUser;
    error?: string;
    errors?: ValidationError[];
}

export interface LogoutResponse extends BaseResponse {
    success: boolean;
    error?: string;
}

// ==========================================
// PAGINATION TYPES
// ==========================================

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends BaseResponse {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
    error?: string;
}

// ==========================================
// CRUD RESPONSE TYPES
// ==========================================

export interface CreateResponse<T = any> extends BaseResponse {
    success: boolean;
    data?: T;
    error?: string;
    errors?: ValidationError[];
}

export interface UpdateResponse<T = any> extends BaseResponse {
    success: boolean;
    data?: T;
    error?: string;
    errors?: ValidationError[];
}

export interface DeleteResponse extends BaseResponse {
    success: boolean;
    deletedCount?: number;
    error?: string;
}

export interface BulkOperationResponse extends BaseResponse {
    success: boolean;
    affectedCount?: number;
    error?: string;
}

// ==========================================
// FETCH RESPONSE TYPES
// ==========================================

export interface FetchOneResponse<T = any> extends BaseResponse {
    success: boolean;
    data?: T;
    error?: string;
}

export interface FetchManyResponse<T = any> extends BaseResponse {
    success: boolean;
    data?: T[];
    total?: number;
    pagination?: PaginationMeta;
    error?: string;
}

// ==========================================
// STATISTICS RESPONSE
// ==========================================

export interface StatisticsResponse extends BaseResponse {
    success: boolean;
    data?: Record<string, any>;
    error?: string;
}

// ==========================================
// FILE UPLOAD RESPONSE
// ==========================================

export interface FileUploadResponse extends BaseResponse {
    success: boolean;
    url?: string;
    filename?: string;
    size?: number;
    error?: string;
}

// ==========================================
// VALIDATION RESPONSE
// ==========================================

export interface ValidationResponse extends BaseResponse {
    success: boolean;
    valid?: boolean;
    errors?: ValidationError[];
    error?: string;
}
