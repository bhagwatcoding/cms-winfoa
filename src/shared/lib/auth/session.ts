import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import { User, Session } from "@/models";
import type { IUser, ISession } from "@/models";

// Session configuration
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "winfoa_session";
const SESSION_MAX_AGE = typeof process.env.SESSION_MAX_AGE === 'string'
  ? parseInt(process.env.SESSION_MAX_AGE, 10)
  : (process.env.SESSION_MAX_AGE || 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  emailVerified: boolean;
  avatar?: string;
  walletBalance?: number;
  centerId?: string;
}

export interface SessionData {
  user: SessionUser;
  sessionToken: string;
  expires: Date;
  isValid: boolean;
}

/**
 * Generate a secure session token
 */
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash a session token for storage
 */
function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Parse user agent to extract device information
 */
function parseUserAgent(userAgent?: string): {
  browser?: string;
  os?: string;
  isMobile?: boolean;
  device?: string;
} {
  if (!userAgent) return {};

  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const browser =
    userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)?.[1] ||
    "Unknown";
  const os =
    userAgent.match(/(Windows|Mac OS|Linux|Android|iOS)/)?.[1] || "Unknown";

  return {
    browser,
    os,
    isMobile,
    device: isMobile ? "Mobile" : "Desktop",
  };
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  request?: NextRequest | { headers: { get(name: string): string | null } },
): Promise<{ sessionToken: string; expires: Date }> {
  await connectDB();

  // Generate session token
  const sessionToken = generateSessionToken();
  const hashedToken = hashSessionToken(sessionToken);
  const expires = new Date(Date.now() + SESSION_MAX_AGE);

  // Extract request information
  const userAgent = request?.headers.get("user-agent") || undefined;
  const ipAddress =
    request?.headers.get("x-forwarded-for") ||
    request?.headers.get("x-real-ip") ||
    undefined;

  // Create session in database
  await Session.create({
    userId,
    sessionToken: hashedToken,
    expires,
    userAgent,
    ipAddress,
    deviceInfo: parseUserAgent(userAgent),
    isActive: true,
    lastAccessedAt: new Date(),
  });

  return { sessionToken, expires };
}

/**
 * Get session from request
 */
export async function getSession(
  request?: NextRequest,
): Promise<SessionData | null> {
  try {
    await connectDB();

    // Get session token from cookie
    let sessionToken: string | undefined;

    if (request) {
      // Server-side with request object
      sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    } else {
      // Server component
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (!sessionToken) {
      return null;
    }

    // Hash the token to match database storage
    const hashedToken = hashSessionToken(sessionToken);

    // Find session in database
    const session = await Session.findOne({
      sessionToken: hashedToken,
      isActive: true,
      expires: { $gt: new Date() },
    }).populate("userId");

    if (!session || !session.userId) {
      return null;
    }

    // Update last accessed time
    session.lastAccessedAt = new Date();
    await session.save();

    // Convert user document to SessionUser
    const user = session.userId as IUser;
    const sessionUser: SessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      avatar: user.avatar,
      walletBalance: user.walletBalance,
      centerId: user.centerId?.toString(),
    };

    return {
      user: sessionUser,
      sessionToken: sessionToken,
      expires: session.expires,
      isValid: true,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Set session cookie
 */
export async function setSessionCookie(
  sessionToken: string,
  expires: Date,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expires,
    path: "/",
    domain:
      process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost",
  });
}

/**
 * Delete session cookie
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Destroy a session
 */
export async function destroySession(sessionToken?: string): Promise<void> {
  try {
    await connectDB();

    if (!sessionToken) {
      // Get token from cookie if not provided
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (!sessionToken) {
      return;
    }

    // Hash the token
    const hashedToken = hashSessionToken(sessionToken);

    // Deactivate session in database
    await Session.findOneAndUpdate(
      { sessionToken: hashedToken },
      { isActive: false },
    );

    // Delete cookie
    await deleteSessionCookie();
  } catch (error) {
    console.error("Error destroying session:", error);
  }
}

/**
 * Destroy all sessions for a user
 */
export async function destroyAllUserSessions(userId: string): Promise<number> {
  try {
    await connectDB();

    const result = await Session.updateMany(
      { userId, isActive: true },
      { isActive: false },
    );

    return result.modifiedCount;
  } catch (error) {
    console.error("Error destroying user sessions:", error);
    return 0;
  }
}

/**
 * Extend session expiry
 */
export async function extendSession(sessionToken: string): Promise<boolean> {
  try {
    await connectDB();

    const hashedToken = hashSessionToken(sessionToken);
    const newExpires = new Date(Date.now() + SESSION_MAX_AGE);

    const result = await Session.findOneAndUpdate(
      {
        sessionToken: hashedToken,
        isActive: true,
        expires: { $gt: new Date() },
      },
      {
        expires: newExpires,
        lastAccessedAt: new Date(),
      },
    );

    if (result) {
      // Update cookie with new expiry
      await setSessionCookie(sessionToken, newExpires);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error extending session:", error);
    return false;
  }
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string): Promise<ISession[]> {
  try {
    await connectDB();

    return await Session.find({
      userId,
      isActive: true,
      expires: { $gt: new Date() },
    }).sort({ lastAccessedAt: -1 });
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return [];
  }
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    await connectDB();
    const result = await Session.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount || 0;
  } catch (error) {
    console.error("Error cleaning up sessions:", error);
    return 0;
  }
}

/**
 * Validate session token format
 */
export function isValidSessionToken(token: string): boolean {
  return (
    typeof token === "string" &&
    token.length === 64 &&
    /^[a-f0-9]+$/.test(token)
  );
}

/**
 * Check if user has permission for a subdomain
 */
export async function hasSubdomainAccess(
  subdomain: string,
  userId?: string,
): Promise<boolean> {
  if (!userId) {
    const session = await getSession();
    if (!session) return false;
    userId = session.user.id;
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) return false;

    // Super admin has access to all subdomains
    if (user.role === "super-admin") return true;

    // Check if user has explicit subdomain access
    if (user.subdomainAccess && user.subdomainAccess.includes(subdomain)) {
      return true;
    }

    // Check role-based default access
    const roleAccess: Record<string, string[]> = {
      admin: [
        "auth",
        "academy",
        "api",
        "ump",
        "provider",
        "myaccount",
        "wallet",
        "developer",
      ],
      staff: ["auth", "academy", "myaccount", "wallet"],
      center: ["auth", "academy", "myaccount"],
      provider: ["auth", "provider", "myaccount", "wallet"],
      student: ["auth", "academy", "myaccount"],
      user: ["auth", "myaccount"],
    };

    return roleAccess[user.role]?.includes(subdomain) || false;
  } catch (error) {
    console.error("Error checking subdomain access:", error);
    return false;
  }
}

/**
 * Require authentication middleware
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }

  return user;
}

/**
 * Require specific role middleware
 */
export async function requireRole(
  roles: string | string[],
): Promise<SessionUser> {
  const user = await requireAuth();

  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    throw new Error(
      `Access denied. Required role: ${allowedRoles.join(" or ")}`,
    );
  }

  return user;
}

/**
 * Session configuration for development/production
 */
export const SESSION_CONFIG = {
  cookieName: SESSION_COOKIE_NAME,
  maxAge: SESSION_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
  domain:
    process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost",
};
