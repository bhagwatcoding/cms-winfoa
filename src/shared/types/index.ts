/**
 * Shared Types - Central Export
 * All TypeScript types and interfaces for the application
 */

// ==========================================
// MODEL TYPES
// ==========================================

export * from "./models";

// ==========================================
// API TYPES
// ==========================================

export * from "./api";

// ==========================================
// ENMUS TYPES
// ==========================================
export * from "./enmus";

// ==========================================
// SESSION TYPES
// ==========================================
// export * from "./session.types";

// ==========================================
// COMMON TYPES
// ==========================================

export type ID = string;
export type Timestamp = Date | string;

// ==========================================
// UTILITY TYPES
// ==========================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
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
  onSort?: (key: string, order: "asc" | "desc") => void;
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

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
