/**
 * Types Index
 * Centralized exports for all TypeScript types and interfaces
 * Organized by subdomain and functionality
 */

// ==========================================
// BASE TYPES (CORE UTILITIES)
// ==========================================
export type {
  ID,
  Timestamp,
  Nullable,
  Optional,
  Maybe,
  DeepPartial,
  RequireAtLeastOne,
  RequireOnlyOne,
  AsyncFunction,
  SyncFunction,
  AnyFunction,
  FormField,
  FormState,
  TableColumn,
  TableProps,
  ModalProps,
  ToastType,
  ToastMessage,
  PaginationParams,
  SearchParams,
  BaseFilterParams,
  BaseResponse,
  SuccessResponse,
  ErrorResponse,
  ApiResponse,
  ValidationError,
  ValidationResult,
  DateRange,
  DateRangeParams,
  ISoftDelete,
} from './base.types';

// ==========================================
// AUTHENTICATION TYPES
// ==========================================
export type {
  ISecurityInfo,
  ISessionBase,
  ISession,
  SessionCreateOptions,
  SessionMiddlewareOptions,
  SessionStats,
  RequestMetadata,
  SessionSignature,
  UserSafeData,
  AuthActionResult,
  LoginResult,
  SessionListItem,
  IClientMeta,
  IGeoInfo,
} from './auth.types';

// ==========================================
// USER TYPES
// ==========================================
export type {
  ILinkedAccount,
  IUserProfile,
  IUserPreferences,
  ITwoFactorSettings,
  ILoginHistory,
  IUserRole,
  IUser,
  CreateUserDTO,
  UpdateUserDTO,
  UserFilterOptions,
  UserSafeData as UserSafeDataType,
} from './user.types';
// ==========================================
// API TYPES
// ==========================================
export type {} from // These should be imported from base.types to avoid conflicts
// PaginationParams,
// SearchParams,
// BaseFilterParams,
// BaseResponse,
// SuccessResponse,
// ErrorResponse,
// ApiResponse,
'./api';

// ==========================================
// ENUMS
// ==========================================
export * from './enums';

// ==========================================
// SUBDOMAIN SPECIFIC TYPES
// ==========================================
export * from './account';
export * from './ump';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================
export * from './schemas';
export * from './validation.utils';
export * from './api/responses';
export * from './api/requests';
export * from './base.types';
