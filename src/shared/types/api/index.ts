/**
 * API Types - Central Export
 */

export type {
  BaseResponse,
  SuccessResponse,
  ErrorResponse,
  ApiResponse,
  AuthUser,
  LoginResponse,
  SignupResponse,
  LogoutResponse,
  PaginationMeta,
  PaginatedResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  BulkOperationResponse,
  FetchOneResponse,
  FetchManyResponse,
  StatisticsResponse,
  FileUploadResponse,
  ValidationResponse,
} from './responses';

export type {
  PaginationParams,
  SearchParams,
  DateRangeParams,
  BaseFilterParams,
  UserFilterParams,
  StudentFilterParams,
  CourseFilterParams,
  CertificateFilterParams,
  BulkDeleteParams,
  BulkUpdateParams,
  IdParam,
  IdsParam,
  QueryParams,
} from './requests';
