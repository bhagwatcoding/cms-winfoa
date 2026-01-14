/**
 * Authentication Actions
 * Professional server actions for authentication and session management
 * Delegates to AuthService for core logic to ensure consistency
 */

'use server';

import { AuthService } from '@/services/auth.service';
import type { AuthActionResult } from '@/types/auth';

// Re-export type for frontend
export type { AuthActionResult };

// ==========================================
// AUTHENTICATION ACTIONS
// ==========================================

/**
 * Login action with professional session management
 */
export async function loginAction(
    email: string,
    password: string,
    rememberMe: boolean = false
): Promise<AuthActionResult> {
    return AuthService.login({ email, password, rememberMe });
}

/**
 * Signup action with professional validation
 */
export async function signupAction(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
}): Promise<AuthActionResult> {
    return AuthService.signup(data);
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<AuthActionResult<void>> {
    return AuthService.logout();
}

/**
 * Logout from all devices
 */
export async function logoutAllDevicesAction(): Promise<AuthActionResult<{ deletedCount: number }>> {
    return AuthService.logoutAllDevices();
}

/**
 * Change password action
 */
export async function changePasswordAction(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<AuthActionResult<void>> {
    return AuthService.changePassword(data);
}

/**
 * Get current session details
 */
export async function getCurrentSessionAction(): Promise<AuthActionResult> {
    return AuthService.getCurrentSession();
}

/**
 * Get all user sessions
 */
export async function getUserSessionsAction(): Promise<AuthActionResult> {
    return AuthService.getUserSessions();
}

/**
 * Delete specific session
 */
export async function deleteSessionAction(sessionId: string): Promise<AuthActionResult<void>> {
    return AuthService.deleteSession(sessionId);
}

/**
 * Verify session signature
 */
export async function verifySessionSignatureAction(
    userId: string,
    sessionId: string,
    token: string,
    signature: string
): Promise<AuthActionResult<{ isValid: boolean }>> {
    return AuthService.verifySignature(userId, sessionId, token, signature);
}

// ==========================================
// REDIRECT ACTIONS
// ==========================================

/**
 * Login with redirect
 */
export async function loginWithRedirectAction(
    email: string,
    password: string,
    rememberMe: boolean = false,
    redirectTo?: string
) {
    return AuthService.loginWithRedirect(
        { email, password, rememberMe },
        redirectTo
    );
}

/**
 * Logout with redirect
 */
export async function logoutWithRedirectAction(redirectTo: string = '/login') {
    return AuthService.logoutWithRedirect(redirectTo);
}
