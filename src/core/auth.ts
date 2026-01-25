/**
 * Professional Authentication Library
 * Secure session management and user authentication
 *
 * @module AuthLib
 */

import { cookies } from 'next/headers';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/core/db/connection';
import { Session } from '@/core/db/models';
import type { IUser, ISession } from '@/core/db/models';
import { DeviceType } from '@/core/db/enums';
import { SESSION } from '@/config';
import { logger } from '@/core/logger';

export type SessionUser = IUser;

// Constants
const SESSION_COOKIE_NAME = SESSION.COOKIE.NAME;
const SESSION_DURATION_DAYS = 7;

/**
 * Hash a password securely
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  await connectDB();

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await Session.create({
    userId,
    token,
    expiresAt,
    deviceInfo: {
      ip: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      type: DeviceType.Unknown,
      browser: 'unknown',
      os: 'unknown',
    },
    geoInfo: {
      // Geo info would go here if available
    },
  });

  logger.info('Session created', { userId, ipAddress });

  return token;
}

/**
 * Get current session and user
 */
export async function getSession(): Promise<{ user: IUser | null; session: ISession | null }> {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { user: null, session: null };
    }

    const session = await Session.findOne({
      token,
      expiresAt: { $gt: new Date() },
    }).populate('userId');

    if (!session) {
      return { user: null, session: null };
    }

    return { user: session.userId as unknown as IUser, session };
  } catch (error) {
    logger.error('Session retrieval error', { error });
    return { user: null, session: null };
  }
}

/**
 * Set session cookie (Login helper)
 */
export async function login(userId: string, userAgent?: string, ipAddress?: string) {
  const token = await createSession(userId, userAgent, ipAddress);
  const cookieStore = await cookies();

  // expiry date calculation
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

/**
 * Destroy session (Logout)
 */
export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await connectDB();
    await Session.findOneAndDelete({ token });
    logger.info('Session destroyed', { token: token.substring(0, 8) + '...' });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require authentication (Guard)
 */
export async function requireAuth() {
  const { user } = await getSession();

  if (!user) {
    throw new Error('Unauthorized - Please login');
  }

  return user;
}

/**
 * Get current user (Convenience)
 */
export async function getCurrentUser() {
  const { user } = await getSession();
  return user;
}

/**
 * Set session cookie directly
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

/**
 * Require specific role(s) for access
 * @param allowedRoles - Array of allowed role slugs
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();

  // God users have full access
  if (user.isGod) {
    return user;
  }

  // Get user's role slug
  let roleSlug: string | undefined;

  if (user.roleId && typeof user.roleId === 'object' && 'slug' in user.roleId) {
    roleSlug = (user.roleId as { slug: string }).slug;
  } else if (user.role) {
    roleSlug = user.role;
  }

  if (!roleSlug || !allowedRoles.includes(roleSlug)) {
    throw new Error(`Forbidden - Required role: ${allowedRoles.join(' or ')}`);
  }

  return user;
}
