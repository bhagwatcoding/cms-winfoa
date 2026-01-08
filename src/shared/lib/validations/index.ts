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
    bulkDeleteUsersSchema,
    bulkUpdateUsersSchema,
    userFilterSchema,
    type CreateUserInput,
    type UpdateUserInput,
    type UpdateProfileInput,
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
} from './schemas/student';

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
} from './schemas/course';

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
    type RevokeCertificateInput,
    type VerifyCertificateInput,
} from './schemas/certificate';

// ==========================================
// VALIDATION UTILITIES
// ==========================================

export {
    validateSchema,
    validateSchemaAsync,
    type ValidationResult,
    type ValidationError,
} from './utils';
