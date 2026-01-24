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
    IDeviceInfo,
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
// MODEL INTERFACES (DATABASE MODELS)
// ==========================================
// Note: These are re-exports from the models folder, but we've already exported
// the core types above, so we'll only export the model-specific ones
export type {
    IActivityLog,
    IApiKey,
    IApiRequest,
    IUserRegistry,
    OAuthProvider,
    ThemeMode,
    NotificationSettings,
    ISessionResult,
} from './models';

export type { IWalletTransaction } from './models/wallet.interface';

// ==========================================
// API TYPES
// ==========================================
export type {
    // These should be imported from base.types to avoid conflicts
    // PaginationParams,
    // SearchParams,
    // BaseFilterParams,
    // BaseResponse,
    // SuccessResponse,
    // ErrorResponse,
    // ApiResponse,
} from './api';

// ==========================================
// ENUMS
// ==========================================
export * from './enums';

// ==========================================
// SUBDOMAIN SPECIFIC TYPES
// ==========================================
export * from './account';
export * from './myaccount';
export * from './ump';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================
export * from './schemas';
export * from './validation.utils';