/**
 * Central Interfaces File
 * All TypeScript interfaces used across the application
 * Organized by domain
 */

// ==========================================
// AUTH INTERFACES
// ==========================================

export interface SignupData {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
}

export interface LoginData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface SessionData {
    userId: string;
    token: string;
    expiresAt: Date;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface VerifyEmailData {
    token: string;
    email?: string;
}

// ==========================================
// USER INTERFACES
// ==========================================

export interface UserData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    walletBalance?: number;
    joinedAt?: Date;
    avatar?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    location?: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    location?: string;
}

// ==========================================
// WALLET INTERFACES
// ==========================================

export interface WalletRechargeData {
    amount: number;
    paymentMethod: string;
}

export interface WalletTransferData {
    recipientEmail: string;
    amount: number;
}

export interface WalletWithdrawalData {
    amount: number;
    bankDetails: Record<string, unknown>;
}

export interface WalletBillPaymentData {
    amount: number;
    billDetails: Record<string, unknown>;
}

export interface WalletBalanceResponse {
    balance: number;
    error?: string;
}

export interface TransactionData {
    id?: string;
    userId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    paymentMethod?: string;
    status?: 'pending' | 'completed' | 'failed';
    metadata?: Record<string, unknown>;
    createdAt?: Date;
}

// ==========================================
// NOTIFICATION INTERFACES
// ==========================================

export interface NotificationData {
    id?: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt?: Date;
}

export interface CreateNotificationData {
    userId: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
}

// ==========================================
// SETTINGS INTERFACES
// ==========================================

export interface EmailNotificationSettings {
    marketing: boolean;
    updates: boolean;
    security: boolean;
}

export interface PushNotificationSettings {
    enabled: boolean;
    messages: boolean;
    alerts: boolean;
}

export interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
}

// ==========================================
// API INTERFACES
// ==========================================

export interface ApiKeyData {
    id?: string;
    userId: string;
    name: string;
    key: string;
    permissions?: string[];
    expiresAt?: Date;
    createdAt?: Date;
}

export interface CreateApiKeyData {
    name: string;
    permissions?: string[];
    expiresAt?: Date;
}

// ==========================================
// ACADEMY INTERFACES
// ==========================================

export interface StudentData {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    enrollmentNumber?: string;
    courseId?: string;
    status?: 'active' | 'inactive' | 'graduated';
    joiningDate?: Date;
}

export interface CourseData {
    id?: string;
    name: string;
    code: string;
    description?: string;
    duration?: number;
    fee?: number;
    status?: 'active' | 'inactive';
}

export interface EmployeeData {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    designation?: string;
    department?: string;
    joiningDate?: Date;
    status?: 'active' | 'inactive';
}

export interface ResultData {
    id?: string;
    studentId: string;
    courseId: string;
    examDate?: Date;
    marks?: number;
    grade?: string;
    status?: 'pass' | 'fail' | 'pending';
}

export interface CertificateData {
    id?: string;
    studentId: string;
    courseId: string;
    issueDate?: Date;
    certificateNumber?: string;
}

export interface AdmitCardData {
    id?: string;
    studentId: string;
    examId: string;
    examDate?: Date;
    venue?: string;
}

// ==========================================
// ACCOUNT MANAGEMENT INTERFACES
// ==========================================

export interface ChangeEmailData {
    newEmail: string;
    password: string;
}

export interface AccountDeletionData {
    password: string;
    confirmation: string;
}

// ==========================================
// COMMON RESPONSE INTERFACES
// ==========================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T = unknown> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    error?: string;
}

export interface ActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Array<{ field: string; message: string }>;
    redirectUrl?: string;
}
