/**
 * API Request Types
 * Standardized request types for filters, queries, and parameters
 */

// ==========================================
// PAGINATION PARAMETERS
// ==========================================

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ==========================================
// SEARCH PARAMETERS
// ==========================================

export interface SearchParams extends PaginationParams {
    search?: string;
    query?: string;
}

// ==========================================
// DATE RANGE PARAMETERS
// ==========================================

export interface DateRangeParams {
    startDate?: Date | string;
    endDate?: Date | string;
    dateFrom?: Date | string;
    dateTo?: Date | string;
}

// ==========================================
// FILTER PARAMETERS
// ==========================================

export interface BaseFilterParams extends PaginationParams, DateRangeParams {
    search?: string;
    status?: string;
    isActive?: boolean;
}

export interface UserFilterParams extends BaseFilterParams {
    role?: string;
    centerId?: string;
    emailVerified?: boolean;
}

export interface StudentFilterParams extends BaseFilterParams {
    centerId?: string;
    courseId?: string;
    gender?: string;
    admissionDateFrom?: Date | string;
    admissionDateTo?: Date | string;
}

export interface CourseFilterParams extends BaseFilterParams {
    centerId?: string;
    category?: string;
    level?: string;
    minDuration?: number;
    maxDuration?: number;
    minFees?: number;
    maxFees?: number;
}

export interface CertificateFilterParams extends BaseFilterParams {
    studentId?: string;
    courseId?: string;
    centerId?: string;
    issueDateFrom?: Date | string;
    issueDateTo?: Date | string;
}

// ==========================================
// BULK OPERATION PARAMETERS
// ==========================================

export interface BulkDeleteParams {
    ids: string[];
}

export interface BulkUpdateParams<T = unknown> {
    ids: string[];
    updates: Partial<T>;
}

// ==========================================
// ID PARAMETERS
// ==========================================

export interface IdParam {
    id: string;
}

export interface IdsParam {
    ids: string[];
}

// ==========================================
// QUERY PARAMETERS
// ==========================================

export interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}
