import { Types } from 'mongoose';
import { Session } from '@/core/db/models';
import { ISession } from '@/core/db/interfaces';
import { SessionStatus } from '@/core/db/enums';
import crypto from 'crypto';

/**
 * Service for Session Management
 */
export class SessionService {
  /**
   * Create a new session
   */
  static async create(
    userId: string | Types.ObjectId,
    deviceInfo: Partial<ISession['deviceInfo']>,
    geoInfo?: Partial<ISession['geoInfo']>,
    durationHours = 24
  ): Promise<ISession> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    const session = new Session({
      userId,
      token,
      deviceInfo,
      geoInfo,
      status: SessionStatus.Active,
      expiresAt,
      lastActiveAt: new Date(),
    });

    return session.save();
  }

  /**
   * Find session by token
   */
  static async findByToken(token: string): Promise<ISession | null> {
    const session = await Session.findOne({ token, status: SessionStatus.Active });

    // Check expiration
    if (session && session.expiresAt < new Date()) {
      session.status = SessionStatus.Expired;
      await session.save();
      return null;
    }

    return session;
  }

  /**
   * Find active sessions for a user
   */
  static async findActiveByUser(userId: string | Types.ObjectId): Promise<ISession[]> {
    return Session.find({
      userId,
      status: SessionStatus.Active,
      expiresAt: { $gt: new Date() },
    }).sort({ lastActiveAt: -1 });
  }

  /**
   * Revoke session
   */
  static async revoke(sessionId: string | Types.ObjectId): Promise<boolean> {
    const result = await Session.findByIdAndUpdate(sessionId, {
      status: SessionStatus.Revoked,
    });
    return !!result;
  }

  /**
   * Revoke all sessions for a user (except current one optionally)
   */
  static async revokeAllForUser(
    userId: string | Types.ObjectId,
    exceptSessionId?: string | Types.ObjectId
  ): Promise<number> {
    const query: Record<string, unknown> = {
      userId,
      status: SessionStatus.Active,
    };

    if (exceptSessionId) {
      query['_id'] = { $ne: exceptSessionId };
    }

    const result = await Session.updateMany(query, {
      status: SessionStatus.Revoked,
    });

    return result.modifiedCount;
  }
}
