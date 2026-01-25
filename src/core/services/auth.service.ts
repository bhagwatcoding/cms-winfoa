import { IUser } from '@/core/db/interfaces';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { LoginAttempt } from '@/core/db/models';
import { LoginAttemptResult } from '@/core/db/enums';
import { ISession } from '@/core/db/interfaces';

/**
 * Service for Authentication
 */
export class AuthService {
  /**
   * Authenticate user by email and password
   */
  static async login(
    email: string,
    password: string,
    ip: string,
    deviceInfo: { userAgent?: string; [key: string]: unknown }
  ): Promise<{ user?: IUser; session?: ISession; error?: string }> {
    // 1. Find User
    const user = await UserService.findByEmail(email);

    // Log attempt start
    const attempt = new LoginAttempt({
      email,
      ip,
      userAgent: deviceInfo.userAgent,
      timestamp: new Date(),
    });

    if (!user) {
      attempt.result = LoginAttemptResult.USER_NOT_FOUND;
      await attempt.save();
      return { error: 'Invalid credentials' };
    }

    // 2. Check Lockout
    if (user.isLocked()) {
      attempt.result = LoginAttemptResult.ACCOUNT_LOCKED;
      await attempt.save();
      return { error: 'Account is locked' };
    }

    // 3. Verify Password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      attempt.result = LoginAttemptResult.FAILED_PASSWORD;
      await attempt.save();
      await user.recordFailedLogin();
      return { error: 'Invalid credentials' };
    }

    // 4. Check status
    if (!user.isActive) {
      attempt.result = LoginAttemptResult.ACCOUNT_INACTIVE;
      await attempt.save();
      return { error: 'Account is inactive' };
    }

    // 5. Success
    attempt.result = LoginAttemptResult.SUCCESS;
    attempt.userId = user._id;
    await attempt.save();

    await user.recordSuccessfulLogin(ip);

    // 6. Create Session
    const session = await SessionService.create(user._id, deviceInfo);

    return { user, session };
  }

  /**
   * Logout (revoke session)
   */
  static async logout(sessionId: string): Promise<boolean> {
    return SessionService.revoke(sessionId);
  }

  /**
   * Validate Session
   */
  static async validateSession(token: string): Promise<ISession | null> {
    return SessionService.findByToken(token);
  }

  /**
   * Request Password Reset
   */
  static async requestPasswordReset(email: string): Promise<string | null> {
    const user = await UserService.findByEmail(email);
    if (!user) return null;

    // Generate token (logic would be here, creating PasswordResetToken)
    // Placeholder implementation
    return 'token_sent';
  }
}
