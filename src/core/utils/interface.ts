/**
 * Core Utils Interface Types
 * Common interface definitions for utilities
 */

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
