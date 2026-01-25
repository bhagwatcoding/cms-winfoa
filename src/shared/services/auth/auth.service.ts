import bcrypt from 'bcryptjs';
import { User, Role } from '@/core/db/models';
import { connectDB } from '@/core/db/connection';
import { UserIdService } from '@/shared/services/admin/userid.service';
import { logger } from '@/core/logger';
import crypto from 'crypto';
import { UserStatus } from '@/core/types/enums';

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async authenticate(email: string, password: string) {
    await connectDB();

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Authentication failed: User not found', { email });
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password || '');

    if (!isValid) {
      logger.warn('Authentication failed: Invalid password', { email });
      throw new Error('Invalid email or password');
    }

    if (user.status !== UserStatus.Active) {
      logger.warn('Authentication failed: Account disabled', { email });
      throw new Error('Your account has been disabled. Please contact support.');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    logger.info('User authenticated successfully', { userId: user._id, email });

    return user;
  }

  /**
   * Register new user
   */
  static async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    phone?: string;
    role?: string;
    oauthProvider?: string;
    oauthId?: string;
    emailVerified?: boolean;
  }) {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase().trim(),
    });

    if (existingUser) {
      logger.warn('Registration failed: Email already exists', { email: userData.email });
      throw new Error('User with this email already exists');
    }

    // Register in UMP and get unique user ID
    // Note: UserIdService needs to be checked if it uses the new DB connection
    const umpRegistration = await UserIdService.registerUser({
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'user',
      metadata: {
        subdomain: 'auth',
        source: 'signup',
        registeredAt: new Date(),
      },
    });

    // Get Role ID
    const roleSlug = userData.role || 'user';
    const role = await Role.findOne({ slug: roleSlug });
    if (!role) {
      throw new Error(`Role not found: ${roleSlug}`);
    }

    // Generate full name if not provided
    const firstName =
      userData.firstName || userData.name?.split(' ')[0] || userData.email.split('@')[0];
    const lastName = userData.lastName || userData.name?.split(' ').slice(1).join(' ') || 'User';

    // Prepare linked accounts if oauth
    const linkedAccounts: Record<string, unknown>[] = [];
    if (userData.oauthProvider && userData.oauthId) {
      linkedAccounts.push({
        provider: userData.oauthProvider,
        providerId: userData.oauthId,
        linkedAt: new Date(),
        email: userData.email,
      });
    }

    // Create user with UMP-generated ID
    const user = await User.create({
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      firstName,
      lastName,
      phone: userData.phone,
      roleId: role._id,
      linkedAccounts,
      emailVerified: userData.emailVerified || false,
      status: UserStatus.Active,
      metadata: {
        umpUserId: umpRegistration.userId,
      },
    });

    // Activate user in UMP after successful creation
    await UserIdService.activateUser(umpRegistration.userId);

    logger.info('User registered successfully', { userId: user._id, email: user.email });

    return user;
  }

  /**
   * Hash password
   */
  static async hashPassword(password: string) {
    return bcrypt.hash(password, 12);
  }

  /**
   * Send verification email (stub)
   */
  static async sendVerificationEmail(user: { email: string; name?: string }) {
    const token = crypto.randomBytes(32).toString('hex');
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

    logger.info(`[DEV] Verification URL for ${user.email}: ${url}`);

    return { token, url };
  }

  /**
   * Request password reset (stub)
   */
  static async requestPasswordReset(email: string) {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      logger.info(`Password reset requested for non-existent email: ${email}`);
      return {
        success: true,
        message: 'If an account exists, a reset email has been sent',
      };
    }

    const token = crypto.randomBytes(32).toString('hex');
    logger.info(`[DEV] Reset URL for ${user.email}: /auth/reset-password?token=${token}`);

    return {
      success: true,
      message: 'If an account exists, a reset email has been sent',
    };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
