/**
 * Base Types
 * Core utility types and interfaces used across the application
 */

// ==========================================
// UTILITY TYPES
// ==========================================

export type ID = string;
export type Timestamp = Date | string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

// ==========================================
// FUNCTION TYPES
// ==========================================

export type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>;
export type SyncFunction<T = unknown> = (...args: unknown[]) => T;
export type AnyFunction<T = unknown> = AsyncFunction<T> | SyncFunction<T>;

// ==========================================
// FORM TYPES
// ==========================================

export interface FormField<T = unknown> {
  name: string;
  value: T;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

export interface FormState<T = unknown> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ==========================================
// TABLE TYPES
// ==========================================

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
}

// ==========================================
// MODAL TYPES
// ==========================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// ==========================================
// TOAST TYPES
// ==========================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ==========================================
// PAGINATION TYPES
// ==========================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  query?: string;
}

export interface BaseFilterParams extends PaginationParams {
  search?: string;
  status?: string;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error: string;
  errors?: ValidationError[];
  code?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ==========================================
// VALIDATION TYPES
// ==========================================

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// ==========================================
// DATE RANGE TYPES
// ==========================================

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangeParams {
  startDate?: Date;
  endDate?: Date;
}

// ==========================================
// SOFT DELETE TYPES
// ==========================================

export interface ISoftDelete {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}
