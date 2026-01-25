/**
 * Authentication Service
 * Centralized authentication and session management
 * Handles login, signup, logout, and session operations
 * Updated to use consolidated SessionService
 */

import { IUser } from '@/core/db/interfaces';
import { AuthService as BaseAuthService } from './auth.service';
import { SessionService, SessionManagementService } from '@/shared/services/session';
import type { AuthActionResult } from '@/shared/types/auth';
import { UserRole, LoginMethod } from '@/core/db/enums';

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

    if ((result as unknown as IUser)?._id) {
      await SessionManagementService.createSession(
        (result as unknown as IUser)._id.toString(),
        LoginMethod.Password,
        { rememberMe: data.rememberMe }
      );
      return { success: true, data: { user: result } } as AuthActionResult;
    }

    return { success: false, error: 'Login failed' } as AuthActionResult;
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
    const roleSlug = data.role ? UserRole[data.role]?.toLowerCase() : undefined;
    const result = await BaseAuthService.register({
      email: data.email,
      password: data.password,
      name: data.name,
      role: roleSlug,
    });

    if ((result as unknown as IUser)?._id) {
      await SessionManagementService.createSession(
        (result as unknown as IUser)._id.toString(),
        LoginMethod.Password
      );
      return { success: true, data: { user: result } } as AuthActionResult;
    }

    return { success: false, error: 'Signup failed' } as AuthActionResult;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<AuthActionResult<void>> {
    const result = await SessionManagementService.logout();
    return { success: result.success } as AuthActionResult<void>;
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
    return SessionService.validateSession(token);
  }

  /**
   * Get current user session
   */
  static async getCurrentSession() {
    return SessionManagementService.getCurrentSessionWithSecurity();
  }
}
