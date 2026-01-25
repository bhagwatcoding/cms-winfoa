/**
 * Signup Form Action
 * Server action for user registration with validation
 */

'use server';

import { redirect } from 'next/navigation';
import { connectDB } from '@/core/db/connection';
import { User, Role } from '@/core/db/models';
import { login as setSessionCookie } from '@/core/auth';
import { validateSchema } from '@/shared/types/validation.utils';
import { signupSchema } from '@/shared/types/schemas/auth.schema';
// import { UserRole } from '@/shared/types/user.types'; // Removed unused
import { UserStatus } from '@/core/db/enums';
import { IUser } from '@/core/db/interfaces';
import { logger } from '@/core/logger';
import bcrypt from 'bcryptjs';

export async function signupAction(prevState: unknown, formData: FormData) {
  let redirectUrl: string | null = null;

  try {
    // Extract form data
    const formDataObj = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      phone: formData.get('phone') as string,
      role: (formData.get('role') as string) || 'user',
    };

    // Validate using Zod schema
    const validationResult = validateSchema(signupSchema, formDataObj);

    if (!validationResult.success || !validationResult.data) {
      return {
        error: validationResult.errors?.[0]?.message || 'Validation failed',
        errors: validationResult.errors,
      };
    }

    const validatedData = validationResult.data;

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: validatedData.email.toLowerCase().trim(),
    });

    if (existingUser) {
      logger.warn('Signup failed: Email exists', { email: validatedData.email });
      return { error: 'Email already registered. Please login instead.' };
    }

    // Create user with proper role mapping
    const userRoleSlug = validatedData.role || 'user';
    const roleDoc = await Role.findOne({ slug: userRoleSlug });

    if (!roleDoc) {
      logger.error('Signup failed: Role not found', { role: userRoleSlug });
      return { error: 'Invalid role configuration' };
    }

    // Use the Model's create method which handles password hashing (pre-save hook) if implemented,
    // otherwise manually hash.
    // const bcrypt = require('bcryptjs'); // Removed in favor of import
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = (await User.create({
      email: validatedData.email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: validatedData.name.trim().split(' ')[0] || validatedData.name.trim(),
      lastName: validatedData.name.trim().split(' ').slice(1).join(' ') || '',
      phone: validatedData.phone?.trim() || '',
      roleId: roleDoc._id,
      status: UserStatus.Active,
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isGod: userRoleSlug === 'god',
      // Default subdomain access
      subdomainAccess: getDefaultSubdomainAccess(userRoleSlug),
    })) as unknown as IUser;

    logger.info('User registered', { userId: user._id, email: user.email, role: userRoleSlug });

    // Create session and set cookie
    await setSessionCookie(user._id.toString());

    // Determine redirect URL based on role
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const appUrlObj = new URL(appUrl);
    const rootDomain = appUrlObj.hostname.replace('www.', '');
    const port = appUrlObj.port ? `:${appUrlObj.port}` : '';

    const getUrl = (subdomain: string) => {
      if (rootDomain === 'localhost') {
        return `${protocol}://${subdomain}.${rootDomain}${port}`;
      }
      return `${protocol}://${subdomain}.${rootDomain}`;
    };

    if (userRoleSlug === 'god') {
      redirectUrl = getUrl('god');
    } else if (['admin', 'staff'].includes(userRoleSlug)) {
      redirectUrl = getUrl('ump');
    } else {
      redirectUrl = getUrl('myaccount');
    }
  } catch (error: unknown) {
    logger.error('Signup action error', { error });
    const errorMessage =
      error instanceof Error ? error.message : 'Signup failed. Please try again.';
    return { error: errorMessage };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return { success: true };
}

// Helper function to get default subdomain access based on role
function getDefaultSubdomainAccess(role: string): string[] {
  const accessMap: Record<string, string[]> = {
    'super-admin': [
      'auth',
      'academy',
      'api',
      'ump',
      'provider',
      'myaccount',
      'wallet',
      'developer',
      'god',
    ],
    god: ['auth', 'academy', 'api', 'ump', 'provider', 'myaccount', 'wallet', 'developer', 'god'],
    admin: ['auth', 'academy', 'api', 'ump', 'myaccount', 'wallet'],
    staff: ['auth', 'academy', 'myaccount', 'wallet'],
    center: ['auth', 'academy', 'myaccount'],
    provider: ['auth', 'provider', 'myaccount', 'wallet'],
    student: ['auth', 'academy', 'myaccount'],
    user: ['auth', 'myaccount'],
  };

  return accessMap[role] || ['auth', 'myaccount'];
}
