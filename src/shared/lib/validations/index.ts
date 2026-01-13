/**
 * Validation Schemas - Central Export
 * All Zod validation schemas organized and exported
 */

// ==========================================
// AUTHENTICATION SCHEMAS
// ==========================================

export {
    loginSchema,
    signupSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    verifyEmailSchema,
    type LoginInput,
    type SignupInput,
    type ForgotPasswordInput,
    type ResetPasswordInput,
    type ChangePasswordInput,
    type VerifyEmailInput,
} from './schemas/auth';

// ==========================================
// USER SCHEMAS
// ==========================================

export {
    userRoleSchema,
    userStatusSchema,
    createUserSchema,
    updateUserSchema,
    updateProfileSchema,
    updateUserPreferencesSchema,
    bulkDeleteUsersSchema,
    bulkUpdateUsersSchema,
    userFilterSchema,
    type CreateUserInput,
    type UpdateUserInput,
    type UpdateProfileInput,
    type UpdateUserPreferencesInput,
    type BulkDeleteUsersInput,
    type BulkUpdateUsersInput,
    type UserFilterInput,
} from './schemas/user';

// ==========================================
// STUDENT SCHEMAS
// ==========================================

export {
    studentGenderSchema,
    studentStatusSchema,
    createStudentSchema,
    updateStudentSchema,
    studentFilterSchema,
    bulkDeleteStudentsSchema,
    bulkUpdateStudentsSchema,
    enrollStudentSchema,
    type CreateStudentInput,
    type UpdateStudentInput,
    type StudentFilterInput,
    type BulkDeleteStudentsInput,
    type BulkUpdateStudentsInput,
    type EnrollStudentInput,
} from './schemas/academy/student';

// ==========================================
// COURSE SCHEMAS
// ==========================================

export {
    createCourseSchema,
    updateCourseSchema,
    courseFilterSchema,
    bulkDeleteCoursesSchema,
    bulkUpdateCoursesSchema,
    type CreateCourseInput,
    type UpdateCourseInput,
    type CourseFilterInput,
    type BulkDeleteCoursesInput,
    type BulkUpdateCoursesInput,
} from './schemas/academy/course';

// ==========================================
// CERTIFICATE SCHEMAS
// ==========================================

export {
    certificateStatusSchema,
    createCertificateSchema,
    updateCertificateSchema,
    certificateFilterSchema,
    issueCertificateSchema,
    revokeCertificateSchema,
    verifyCertificateSchema,
    type CreateCertificateInput,
    type UpdateCertificateInput,
    type CertificateFilterInput,
    type IssueCertificateInput,
    type VerifyCertificateInput,
} from './schemas/academy/certificate';

// ==========================================
// EMPLOYEE SCHEMAS
// ==========================================

export {
    employeeStatusSchema,
    createEmployeeSchema,
    updateEmployeeSchema,
    type CreateEmployeeInput,
    type UpdateEmployeeInput,
} from './schemas/academy/employee';

// ==========================================
// RESULT SCHEMAS
// ==========================================

export {
    resultStatusSchema,
    createResultSchema,
    updateResultSchema,
    type CreateResultInput,
    type UpdateResultInput,
} from './schemas/academy/result';

// ==========================================
// ADMIT CARD SCHEMAS
// ==========================================

export {
    admitCardStatusSchema,
    createAdmitCardSchema,
    updateAdmitCardSchema,
    type CreateAdmitCardInput,
    type UpdateAdmitCardInput,
} from './schemas/academy/admit-card';

// ==========================================
// NOTIFICATION SCHEMAS
// ==========================================

export {
    notificationTypeSchema,
    createNotificationSchema,
    updateNotificationSchema,
    type CreateNotificationInput,
    type UpdateNotificationInput,
} from './schemas/notification';

// ==========================================
// TRANSACTION SCHEMAS
// ==========================================

export {
    transactionTypeSchema,
    transactionStatusSchema,
    createTransactionSchema,
    updateTransactionSchema,
    type CreateTransactionInput,
    type UpdateTransactionInput,
} from './schemas/transaction';

// ==========================================
// API KEY SCHEMAS
// ==========================================

export {
    createApiKeySchema,
    updateApiKeySchema,
    type CreateApiKeyInput,
    type UpdateApiKeyInput,
} from './schemas/api-key';

// ==========================================
// VALIDATION UTILITIES
// ==========================================

export {
    serialize,
    validateSchema,
    validateSchemaAsync,
    type ValidationResult,
    type ValidationError,
} from './utils';
