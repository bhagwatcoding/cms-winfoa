/**
 * Authentication Service
 * Centralized authentication and session management
 * Handles login, signup, logout, and session operations
 * Updated to use consolidated SessionService
 */

import { AuthService as BaseAuthService } from './auth.service';
import { SessionService, SessionManagementService } from '@/shared/services/session';
import type { AuthActionResult } from '@/types/auth';
import type { UserRole } from '@/types/models';
import { isValidLoginMethod, LoginMethod, LoginMethodLabel } from '@/types';

export class AuthService {
    /**
     * Login user with email and password
     */
    static async login(data: {
        email: string;
        password: string;
        rememberMe?: boolean;
    }): Promise<AuthActionResult> {
    const result = await BaseAuthService.authenticate(data.email, data.password);
        
    if ((result as any)?._id) {
      await SessionManagementService.createSession(
        (result as any)._id.toString(),
        LoginMethod.Password,
        { rememberMe: data.rememberMe }
      );
      return { success: true, data: { user: result } } as any;
    }
        
    return { success: false, error: 'Login failed' } as any;
    }

    /**
     * Signup new user
     */
    static async signup(data: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role?: UserRole;
    }): Promise<AuthActionResult> {
    const result = await BaseAuthService.register({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    } as any);
        
    if ((result as any)?._id) {
      await SessionManagementService.createSession(
        (result as any)._id.toString(),
        LoginMethod.Password
      );
      return { success: true, data: { user: result } } as any;
    }
        
    return { success: false, error: 'Signup failed' } as any;
    }

    /**
     * Logout user
     */
  static async logout(): Promise<AuthActionResult<void>> {
    const result = await SessionManagementService.logout();
    return { success: result.success } as any;
  }

    /**
     * Create session for user
     */
    static async createSession(userId: string, method?: LoginMethod): Promise<void> { 
      SessionManagementService.createSession(userId, method || LoginMethod.Password);
    }

    /**
     * Validate session
     */
    static async validateSession(token: string): Promise<boolean> {
        return SessionManagementService.revokeSession(token);
    }

    /**
     * Get current user session
     */
    static async getCurrentSession() {
        return SessionManagementService.getCurrentSessionWithSecurity();
    }
}
