/**
 * Authentication Actions
 * Professional server actions for authentication and session management
 * Delegates to AuthService for core logic to ensure consistency
 */

'use server';

import { AuthService } from '@/shared/services';
import type { AuthActionResult } from '@/types/auth';
import type { UserRole } from '@/types/models';

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
    role?: UserRole;
}): Promise<AuthActionResult> {
    return AuthService.signup(data);
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<AuthActionResult<void>> {
    return AuthService.logout();
}