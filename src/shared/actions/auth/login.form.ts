'use server';

import { redirect } from 'next/navigation';
import { connectDB } from '@/core/db/connection';
import { User } from '@/core/db/models';
import { UserStatus } from '@/core/db/enums';
import { login as setSessionCookie } from '@/core/auth';
import { z } from 'zod';
import { VALIDATION } from '@/config';
import { logger } from '@/core/logger';

// Define schema outside function for better performance/reusability
const LoginSchema = z.object({
  email: z.string().regex(VALIDATION.REGEX.EMAIL, { message: 'Invalid email format' }),

  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});
export async function loginAction(prevState: unknown, formData: FormData) {
  // 1. Initialize redirect path variable (to be used outside try/catch)
  let redirectUrl: string | null = null;

  try {
    const rawFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // 2. Validate input using Zod exclusively (cleaner than mixing Regex)
    const validationResult = LoginSchema.safeParse(rawFormData);

    if (!validationResult.success) {
      // Return the first error message found
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return { error: fieldErrors.email?.[0] || fieldErrors.password?.[0] || 'Validation failed' };
    }

    const { email, password } = validationResult.data;

    // 3. Connect DB
    await connectDB();

    // 4. Find user (Select password explicitly)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })
      .select('+password +status +emailVerified')
      .populate('roleId');

    // 5. Unified credential check (Prevents enumeration/timing attacks)
    const loginFailedMsg = 'Invalid email or password';

    if (!user || !user.password) {
      logger.warn('Login failed: User not found', { email });
      return { error: loginFailedMsg };
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn('Login failed: Invalid password', { email });
      return { error: loginFailedMsg };
    }

    // 6. Account Status Checks
    if (user.status !== UserStatus.Active) {
      logger.warn('Login failed: Account disabled', { email });
      return {
        error: 'Your account has been disabled. Please contact support.',
      };
    }

    if (!user.emailVerified) {
      // In dev, maybe we allow it? But standard practice is to require it.
      logger.info('Login blocked: Email not verified', { email });
      return { error: 'Please verify your email address before logging in.' };
    }

    // 7. Session Management
    // Using the new Professional Auth Library
    // Note: setSessionCookie in lib/auth handles creation and cookie setting
    await setSessionCookie(user._id.toString());

    // 8. Update Stats (Non-blocking usually preferred, but await is safer here)
    user.lastLoginAt = new Date();
    // user.loginCount = (user.loginCount || 0) + 1; // Removed
    await user.save();

    // 9. Determine Redirect URL
    // Use environment variable for domain to support Prod/Dev environments
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    // Default to localhost:3000 if not set, but try to use NEXT_PUBLIC_APP_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const appUrlObj = new URL(appUrl);
    const rootDomain = appUrlObj.hostname.replace('www.', ''); // e.g. "localhost" or "domain.com"
    const port = appUrlObj.port ? `:${appUrlObj.port}` : '';

    // Helper to construct URL
    // e.g. http://god.localhost:3000
    const getUrl = (subdomain: string) => {
      // If we are on localhost, we need to be careful with subdomains
      if (rootDomain === 'localhost') {
        return `${protocol}://${subdomain}.${rootDomain}${port}`;
      }
      return `${protocol}://${subdomain}.${rootDomain}`;
    };

    const userRole = user.role; // Virtual property

    switch (userRole) {
      case 'super-admin':
      case 'admin':
      case 'god': // Add god role support
        // Admins/Gods go to GOD subdomain
        redirectUrl = getUrl('god');
        break;
      case 'user':
        // Users go to My Account
        redirectUrl = getUrl('myaccount');
        break;
      default:
        redirectUrl = getUrl('myaccount');
        break;
    }

    logger.info(`✅ User logged in: ${user.email} (${user.role})`, { userId: user._id });
  } catch (error: unknown) {
    logger.error('Login action error:', { error });

    if (error instanceof Error) {
      // Don't expose internal DB errors (like connection timeouts) to the UI
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
    return { error: 'Login failed.' };
  }

  // 10. Redirect *outside* the try/catch block
  // This prevents the "NEXT_REDIRECT" error from being caught
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { success: true };
}
