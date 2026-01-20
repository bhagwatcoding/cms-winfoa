'use server';
/**
 * AuthService - Professional Authentication Service
 * Organized class-based authentication with modular architecture
 */
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import { User } from '@/models';
import SessionService from '@/services/session.service';
import type { IUser } from '@/models';

// Validation
import {
    loginSchema,
    signupSchema,
    changePasswordSchema,
    type LoginInput,
    type SignupInput,
    type ChangePasswordInput,
} from '@/shared/lib/utils/schemas';

// Security
import {
    hashPassword,
    verifyPassword,
    createSessionSignature,
    verifySessionSignature,
    checkRateLimit,
    clearRateLimit,
    logSecurityEvent,
    type AuditLogEntry,
} from '@/lib/security/auth.security';

// Helpers
import {
    getRequestMetadata, toSafeUserData, getRoleBasedRedirect, createErrorResponse, createSuccessResponse, parseUserAgent,
} from '@/lib/helpers/auth.helpers';

// Use centralized types
import type { AuthActionResult, LoginResult, SessionListItem, SessionSignature, UserSafeData, } from '@/types/auth';

// Re-export type for consumers who used to import from here
export type { AuthActionResult };

// ==========================================
// AUTH SERVICE CLASS
// ==========================================

export class AuthService {

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    /**
     * Create authenticated session with signature
     */
    private static async createAuthSession(
        user: IUser,
        rememberMe: boolean = false
    ): Promise<SessionSignature> {
        const metadata = await getRequestMetadata();
        const deviceInfo = parseUserAgent(metadata.userAgent);

        // Create session
        const payload = {
            userId: user._id.toString(),
            ipAddress: metadata.ipAddress || '',
            isRememberMe?: rememberMe,
            loginMethod?: 'PASSWORD',
            deviceInfo?: Partial<IDeviceInfo>,
            rememberMe,
        }
        const session = await SessionService.create(payload);

        // Create signature for additional security
        const signature = createSessionSignature(
            user._id.toString(),
            session._id.toString(),
            session.token
        );

        // Set cookie
        await SessionService.setCookie(session.token, session.expiresAt);

        return {
            userId: user._id.toString(),
            sessionId: session._id.toString(),
            token: session.token,
            signature,
            expiresAt: session.expiresAt,
            deviceInfo: {
                browser: session.deviceInfo?.browser,
                os: session.deviceInfo?.os,
                device: session.deviceInfo?.device,
                type: session.deviceInfo?.type,
                isMobile: session.deviceInfo?.isMobile,
                ipAddress: metadata.ipAddress,
            },
        };
    }

    /**
     * Log authentication event
     */
    private static async logAuthEvent(
        event: Omit<AuditLogEntry, 'timestamp'>
    ): Promise<void> {
        const metadata = await getRequestMetadata();

        logSecurityEvent({
            ...event,
            ipAddress: metadata.ipAddress,
            userAgent: metadata.userAgent,
            timestamp: new Date(),
        });
    }

    // ==========================================
    // AUTHENTICATION METHODS
    // ==========================================

    /**
     * Login with email and password
     */
    static async login(input: LoginInput): Promise<AuthActionResult<LoginResult>> {
        try {
            // Validate input
            const validation = loginSchema.safeParse(input);
            if (!validation.success) {
                return createErrorResponse(
                    validation.error.issues[0].message,
                    'VALIDATION_ERROR'
                );
            }

            const { email, password, rememberMe } = validation.data;

            // Check rate limit
            const rateLimit = checkRateLimit(email);
            if (!rateLimit.allowed) {
                await this.logAuthEvent({
                    action: 'LOGIN_RATE_LIMITED',
                    email,
                    success: false,
                    error: 'Rate limit exceeded',
                });

                return createErrorResponse(
                    `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.`,
                    'RATE_LIMITED'
                );
            }

            // Connect to database
            await connectDB();

            // Find user
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                await this.logAuthEvent({
                    action: 'LOGIN_FAILED',
                    email,
                    success: false,
                    error: 'User not found',
                });

                return createErrorResponse('Invalid email or password', 'INVALID_CREDENTIALS');
            }

            // Verify password
            const isValid = await verifyPassword(password, user.password);
            if (!isValid) {
                await this.logAuthEvent({
                    action: 'LOGIN_FAILED',
                    userId: user._id.toString(),
                    email,
                    success: false,
                    error: 'Invalid password',
                });

                return createErrorResponse('Invalid email or password', 'INVALID_CREDENTIALS');
            }

            // Check if user is active
            if (!user.isActive) {
                await this.logAuthEvent({
                    action: 'LOGIN_BLOCKED',
                    userId: user._id.toString(),
                    email,
                    success: false,
                    error: 'Account deactivated',
                });

                return createErrorResponse(
                    'Your account has been deactivated. Please contact support.',
                    'ACCOUNT_DEACTIVATED'
                );
            }

            // Check session limit
            const exceeded = await SessionService.isSessionLimitExceeded(
                user._id.toString(),
                5
            );
            if (exceeded) {
                return createErrorResponse(
                    'Maximum 5 devices allowed. Please logout from another device.',
                    'SESSION_LIMIT_EXCEEDED'
                );
            }

            // Create session with signature
            const sessionData = await this.createAuthSession(user, rememberMe);

            // Update last login
            user.lastLoginAt = new Date();
            await user.save();

            // Clear rate limit on success
            clearRateLimit(email);

            // Log success
            await this.logAuthEvent({
                action: 'LOGIN_SUCCESS',
                userId: user._id.toString(),
                email,
                success: true,
                metadata: {
                    rememberMe,
                    deviceInfo: sessionData.deviceInfo,
                },
            });

            return createSuccessResponse<LoginResult>(
                {
                    user: toSafeUserData(user),
                    session: {
                        sessionId: sessionData.sessionId,
                        signature: sessionData.signature,
                        expiresAt: sessionData.expiresAt,
                    },
                },
                'Login successful'
            );
        } catch (error) {
            console.error('Login error:', error);

            await this.logAuthEvent({
                action: 'LOGIN_ERROR',
                email: input.email,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            return createErrorResponse(
                'An error occurred during login. Please try again.',
                'INTERNAL_ERROR'
            );
        }
    }

    /**
     * Register new user
     */
    static async signup(input: SignupInput): Promise<AuthActionResult<LoginResult>> {
        try {
            // Validate input
            const validation = signupSchema.safeParse(input);
            if (!validation.success) {
                return createErrorResponse(
                    validation.error.issues[0].message,
                    'VALIDATION_ERROR'
                );
            }

            const { name, email, password, role } = validation.data;

            await connectDB();

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                await this.logAuthEvent({
                    action: 'SIGNUP_FAILED',
                    email,
                    success: false,
                    error: 'Email already registered',
                });

                return createErrorResponse('Email already registered', 'EMAIL_EXISTS');
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'user',
                isActive: true,
                emailVerified: false,
                createdAt: new Date(),
            });

            // Create session
            const sessionData = await this.createAuthSession(user, false);

            // Log success
            await this.logAuthEvent({
                action: 'SIGNUP_SUCCESS',
                userId: user._id.toString(),
                email,
                success: true,
                metadata: { role: user.role },
            });

            return createSuccessResponse<LoginResult>(
                {
                    user: toSafeUserData(user),
                    session: {
                        sessionId: sessionData.sessionId,
                        signature: sessionData.signature,
                        expiresAt: sessionData.expiresAt,
                    },
                },
                'Account created successfully'
            );
        } catch (error) {
            console.error('Signup error:', error);

            await this.logAuthEvent({
                action: 'SIGNUP_ERROR',
                email: input.email,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            return createErrorResponse(
                'An error occurred during signup. Please try again.',
                'INTERNAL_ERROR'
            );
        }
    }

    /**
     * Logout current user
     */
    static async logout(): Promise<AuthActionResult<void>> {
        try {
            const user = await SessionService.getCurrentUser();

            await SessionService.logout();

            if (user) {
                await this.logAuthEvent({
                    action: 'LOGOUT_SUCCESS',
                    userId: user._id.toString(),
                    email: user.email,
                    success: true,
                });
            }

            return createSuccessResponse(undefined, 'Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            return createErrorResponse('An error occurred during logout', 'INTERNAL_ERROR');
        }
    }

    /**
     * Logout from all devices
     */
    static async logoutAllDevices(): Promise<AuthActionResult<{ deletedCount: number }>> {
        try {
            const user = await SessionService.getCurrentUser();
            if (!user) {
                return createErrorResponse('Not authenticated', 'NOT_AUTHENTICATED');
            }

            const deletedCount = await SessionService.deleteAllForUser(user._id.toString());

            await this.logAuthEvent({
                action: 'LOGOUT_ALL_DEVICES',
                userId: user._id.toString(),
                email: user.email,
                success: true,
                metadata: { deletedCount },
            });

            return createSuccessResponse(
                { deletedCount },
                `Logged out from ${deletedCount} devices`
            );
        } catch (error) {
            console.error('Logout all error:', error);
            return createErrorResponse('An error occurred', 'INTERNAL_ERROR');
        }
    }

    /**
     * Change password
     */
    static async changePassword(
        input: ChangePasswordInput
    ): Promise<AuthActionResult<void>> {
        try {
            // Validate input
            const validation = changePasswordSchema.safeParse(input);
            if (!validation.success) {
                return createErrorResponse(
                    validation.error.issues[0].message,
                    'VALIDATION_ERROR'
                );
            }

            const { currentPassword, newPassword } = validation.data;

            // Get current user
            const currentUser = await SessionService.requireAuth();

            await connectDB();

            // Get user with password
            const user = await User.findById(currentUser._id).select('+password');
            if (!user) {
                return createErrorResponse('User not found', 'USER_NOT_FOUND');
            }

            // Verify current password
            const isValid = await verifyPassword(currentPassword, user.password);
            if (!isValid) {
                await this.logAuthEvent({
                    action: 'PASSWORD_CHANGE_FAILED',
                    userId: user._id.toString(),
                    email: user.email,
                    success: false,
                    error: 'Invalid current password',
                });

                return createErrorResponse('Current password is incorrect', 'INVALID_PASSWORD');
            }

            // Hash new password
            const hashedPassword = await hashPassword(newPassword);

            // Update password
            user.password = hashedPassword;
            await user.save();

            // Logout from all other devices for security
            await SessionService.deleteOtherSessions();

            // Log success
            await this.logAuthEvent({
                action: 'PASSWORD_CHANGED',
                userId: user._id.toString(),
                email: user.email,
                success: true,
            });

            return createSuccessResponse(
                undefined,
                'Password changed successfully. You have been logged out from other devices.'
            );
        } catch (error) {
            console.error('Change password error:', error);
            return createErrorResponse(
                'An error occurred while changing password',
                'INTERNAL_ERROR'
            );
        }
    }

    // ==========================================
    // SESSION MANAGEMENT
    // ==========================================

    /**
     * Get current session details
     */
    static async getCurrentSession(): Promise<AuthActionResult<{
        user: UserSafeData;
        session: {
            sessionId: string;
            signature: string;
            expiresAt: Date;
            deviceInfo: any;
            lastAccessedAt: Date;
        };
    }>> {
        try {
            const result = await SessionService.getUserWithSession();

            if (!result) {
                return createErrorResponse('Not authenticated', 'NOT_AUTHENTICATED');
            }

            const { user, session } = result;

            // Create signature for verification
            const signature = createSessionSignature(
                user._id.toString(),
                session._id.toString(),
                session.token
            );

            return createSuccessResponse({
                user: toSafeUserData(user),
                session: {
                    sessionId: session._id.toString(),
                    signature,
                    expiresAt: session.expiresAt,
                    deviceInfo: session.deviceInfo,
                    lastAccessedAt: session.lastAccessedAt,
                },
            });
        } catch (error) {
            console.error('Get session error:', error);
            return createErrorResponse('An error occurred', 'INTERNAL_ERROR');
        }
    }

    /**
     * Get all user sessions
     */
    static async getUserSessions(): Promise<AuthActionResult<{
        sessions: SessionListItem[];
        total: number;
    }>> {
        try {
            const user = await SessionService.requireAuth();
            const sessions = await SessionService.getAllForUser(user._id.toString());
            const currentToken = await SessionService.getToken();

            const formattedSessions: SessionListItem[] = sessions.map((session) => {
                const formatted = SessionService.formatSession(session);
                const signature = createSessionSignature(
                    user._id.toString(),
                    session._id.toString(),
                    session.token
                );

                return {
                    ...formatted,
                    isCurrent: session.token === currentToken,
                    signature,
                };
            });

            return createSuccessResponse({
                sessions: formattedSessions,
                total: formattedSessions.length,
            });
        } catch (error) {
            console.error('Get sessions error:', error);
            return createErrorResponse('An error occurred', 'INTERNAL_ERROR');
        }
    }

    /**
     * Delete specific session
     */
    static async deleteSession(sessionId: string): Promise<AuthActionResult<void>> {
        try {
            const user = await SessionService.requireAuth();

            // Verify session belongs to user
            const session = await SessionService.getById(sessionId);
            if (!session || session.userId.toString() !== user._id.toString()) {
                return createErrorResponse(
                    'Session not found or unauthorized',
                    'UNAUTHORIZED'
                );
            }

            await SessionService.deleteById(sessionId);

            await this.logAuthEvent({
                action: 'SESSION_DELETED',
                userId: user._id.toString(),
                email: user.email,
                success: true,
                metadata: { sessionId },
            });

            return createSuccessResponse(undefined, 'Session deleted successfully');
        } catch (error) {
            console.error('Delete session error:', error);
            return createErrorResponse('An error occurred', 'INTERNAL_ERROR');
        }
    }

    /**
     * Verify session signature
     */
    static async verifySignature(
        userId: string,
        sessionId: string,
        token: string,
        signature: string
    ): Promise<AuthActionResult<{ isValid: boolean }>> {
        try {
            const isValid = verifySessionSignature(userId, sessionId, token, signature);

            return createSuccessResponse(
                { isValid },
                isValid ? 'Signature valid' : 'Invalid signature'
            );
        } catch (error) {
            console.error('Verify signature error:', error);
            return createErrorResponse('An error occurred', 'INTERNAL_ERROR');
        }
    }

    // ==========================================
    // REDIRECT METHODS
    // ==========================================

    /**
     * Login with automatic redirect
     */
    static async loginWithRedirect(
        input: LoginInput,
        redirectTo?: string
    ): Promise<never> {
        const result = await this.login(input);

        if (result.success && result.data) {
            const url = redirectTo || getRoleBasedRedirect(result.data.user.role);
            redirect(url);
        }

        // If failed, redirect to login with error
        redirect(`/login?error=${encodeURIComponent(result.error || 'Login failed')}`);
    }

    /**
     * Logout with automatic redirect
     */
    static async logoutWithRedirect(redirectTo: string = '/login'): Promise<never> {
        await this.logout();
        redirect(redirectTo);
    }
}
