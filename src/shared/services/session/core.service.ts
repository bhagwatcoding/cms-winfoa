/**
 * Session Core Service
 * Core session management functionality
 * Handles basic session operations like creation, validation, and retrieval
 */

import 'server-only';
import { cookies } from 'next/headers';
import { Session } from '@/models';
import { ISession, IDeviceInfo, IGeoInfo, ISecurityInfo } from '@/core/db/interfaces';
import { DataSealer } from '@/lib/sealer';
import { SessionStatus } from '@/types';
import { connectDB } from '@/lib/db';
import { SESSION } from '@/config';

export class SessionCoreService {
  private static COOKIE_NAME = SESSION.COOKIE.NAME;
  private static SESSION_DURATION = SESSION.DURATION.MAX_AGE; // 30 days

  /**
   * Create a new session with basic configuration
   */
  static async createSession(
    userId: string,
    token: string,
    metadata?: {
      userAgent?: string;
      ipAddress?: string;
      rememberMe?: boolean;
      deviceInfo?: IDeviceInfo;
      geoInfo?: IGeoInfo;
      securityInfo?: ISecurityInfo;
    }
  ) {
    await connectDB();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.SESSION_DURATION);

    const session = await Session.create({
      userId,
      token,
      expiresAt,
      deviceInfo: metadata?.deviceInfo || {},
      geoInfo: metadata?.geoInfo || {},
      securityInfo: metadata?.securityInfo || {},
      isActive: true,
      status: SessionStatus.Active,
      lastAccessedAt: new Date(),
    });

    // Set cookie
    const sealedValue = DataSealer.sealCookie(this.COOKIE_NAME, token);
    const cookieStore = await cookies();

    cookieStore.set(this.COOKIE_NAME, sealedValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN?.replace(/:\d+$/, '')}`
          : undefined,
    });

    return session;
  }

  /**
   * Get current session from cookie
   */
  static async getCurrentSession(): Promise<ISession | null> {
    try {
      await connectDB();
      const cookieStore = await cookies();
      const sealedValue = cookieStore.get(this.COOKIE_NAME)?.value;

      const rawToken = DataSealer.unsealCookie(this.COOKIE_NAME, sealedValue);
      if (!rawToken) return null;

      const session = await Session.findOne({
        token: rawToken,
        isActive: true,
        status: SessionStatus.Active,
        expiresAt: { $gt: new Date() },
      }).populate('userId');

      if (!session) {
        return null;
      }

      // Update last access time
      session.lastAccessedAt = new Date();
      await session.save();

      return session;
    } catch (error) {
      console.error('Session retrieval error:', error);
      return null;
    }
  }

  /**
   * Validate session token
   */
  static async validateSession(token: string): Promise<boolean> {
    try {
      await connectDB();
      const session = await Session.findOne({
        token,
        isActive: true,
        expiresAt: { $gt: new Date() },
      });

      return !!session;
    } catch {
      return false;
    }
  }

  /**
   * Invalidate session (logout)
   */
  static async invalidateSession(session: ISession): Promise<void> {
    try {
      session.status = SessionStatus.Revoked;
      session.isActive = false;
      await session.save();

      // Clear cookie
      const cookieStore = await cookies();
      cookieStore.set(this.COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
        domain:
          process.env.NODE_ENV === 'production'
            ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN?.replace(/:\d+$/, '')}`
            : undefined,
      });
    } catch (error) {
      console.error('Session invalidation error:', error);
    }
  }

  /**
   * Generate secure session token
   */
  static generateSessionToken(): string {
    return DataSealer.generateID(64); // High entropy token
  }

  /**
   * Get session by ID
   */
  static async getSessionById(sessionId: string): Promise<ISession | null> {
    try {
      await connectDB();
      return await Session.findById(sessionId).populate('userId');
    } catch (error) {
      console.error('Get session by ID error:', error);
      return null;
    }
  }

  /**
   * Get sessions by user ID
   */
  static async getSessionsByUserId(userId: string): Promise<ISession[]> {
    try {
      await connectDB();
      return await Session.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Get sessions by user ID error:', error);
      return [];
    }
  }
}
