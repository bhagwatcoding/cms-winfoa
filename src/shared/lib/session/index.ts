/**
 * Session Management Utilities
 * High-performance session handling with caching and validation
 */

import { cookies } from "next/headers";
import { cache } from "react";
import connectDB from "@/lib/db";
import { Session, User } from "@/models";
import type { ISession, IUser } from "@/models";
import { SESSION } from "@/config";

import {
  generateSignedSessionToken,
  verifySessionToken,
  validateSecretStrength,
} from "@/lib/crypto";

// ==========================================
// CONSTANTS
// ==========================================

// Session configuration from centralized config
const SESSION_COOKIE_NAME = SESSION.COOKIE_NAME;
const SESSION_MAX_AGE = SESSION.DURATION * 1000; // Convert seconds to milliseconds

// Validate secret strength on module load
validateSecretStrength();

// ==========================================
// SESSION CREATION
// ==========================================

/**
 * Create a new session for a user
 * Uses cryptographically signed session tokens
 * @param userId - User ID
 * @param userAgent - User agent string
 * @param ipAddress - IP address
 * @returns Created session
 */
export async function createSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<ISession> {
  await connectDB();

  // Generate signed session token
  const token = generateSignedSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  const session = await Session.create({
    userId,
    token,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return session;
}

/**
 * Set session cookie
 * @param token - Session token
 * @param expiresAt - Expiration date
 */
export async function setSessionCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...SESSION.COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

// ==========================================
// SESSION VALIDATION
// ==========================================

/**
 * Get current session token from cookies
 * @returns Session token or null
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

/**
 * Validate session and get session data
 * Verifies cryptographic signature before database lookup
 * Cached for performance
 * @param token - Signed session token
 * @returns Session or null
 */
export const validateSession = cache(
  async (token: string): Promise<ISession | null> => {
    if (!token) return null;

    // Verify token signature first (fast check before DB)
    const unsignedToken = verifySessionToken(token);
    if (!unsignedToken) {
      console.warn("Invalid session token signature");
      return null;
    }

    await connectDB();

    const session = await Session.findOne({
      token,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!session) return null;

    return session as ISession;
  },
);

/**
 * Get current session (cached)
 * @returns Current session or null
 */
export const getCurrentSession = cache(async (): Promise<ISession | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  return validateSession(token);
});

// ==========================================
// USER RETRIEVAL
// ==========================================

/**
 * Get current user from session (cached)
 * High-performance with React cache
 * @returns Current user or null
 */
export const getCurrentUser = cache(async (): Promise<IUser | null> => {
  const session = await getCurrentSession();
  if (!session) return null;

  await connectDB();

  const user = await User.findById(session.userId).select("-password").lean();

  if (!user) return null;

  return user as IUser;
});

/**
 * Require authenticated user (throw if not authenticated)
 * @returns Current user
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<IUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - Please login");
  }

  return user;
}

/**
 * Require specific role
 * @param allowedRoles - Array of allowed roles
 * @returns Current user
 * @throws Error if not authorized
 */
export async function requireRole(allowedRoles: string[]): Promise<IUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden - Insufficient permissions");
  }

  return user;
}

// ==========================================
// SESSION DESTRUCTION
// ==========================================

/**
 * Delete session and clear cookie
 * @param token - Session token
 */
export async function deleteSession(token: string): Promise<void> {
  await connectDB();

  await Session.findOneAndDelete({ token });

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const token = await getSessionToken();

  if (token) {
    await deleteSession(token);
  }
}

// ==========================================
// SESSION MAINTENANCE
// ==========================================

/**
 * Clean up expired sessions
 * Should be run periodically
 */
export async function cleanupExpiredSessions(): Promise<number> {
  await connectDB();

  const result = await Session.deleteMany({
    expiresAt: { $lt: new Date() },
  });

  return result.deletedCount || 0;
}

/**
 * Extend session expiration
 * @param token - Session token
 * @returns Updated session
 */
export async function extendSession(token: string): Promise<ISession | null> {
  await connectDB();

  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);

  const session = await Session.findOneAndUpdate(
    { token },
    { expiresAt },
    { new: true },
  );

  if (session) {
    await setSessionCookie(token, expiresAt);
  }

  return session;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get user ID from current session
 * @returns User ID or null
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.userId.toString() || null;
}

/**
 * Check if user is authenticated
 * @returns True if authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session;
}

/**
 * Check if user has specific role
 * @param role - Role to check
 * @returns True if user has role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user has any of the roles
 * @param roles - Roles to check
 * @returns True if user has any role
 */
export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user && roles.includes(user.role);
}
