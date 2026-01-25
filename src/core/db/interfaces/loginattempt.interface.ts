/**
 * Login Attempt Interfaces
 * Type definitions for login attempt tracking
 */

import { Document, Types } from 'mongoose';
import { IGeoInfo, IDeviceInfo } from './core.interface';
import { LoginAttemptResult } from '@/core/db/enums';

// Re-export enum for convenience
export { LoginAttemptResult };

// ==========================================
// INTERFACE
// ==========================================

export interface ILoginAttempt extends Document {
  // User identification
  email: string;
  userId?: Types.ObjectId;

  // Result - stored as number
  success: boolean;
  result: LoginAttemptResult;
  failureReason?: string;

  // Request context
  ipAddress: string;
  geoInfo?: IGeoInfo;
  deviceInfo?: Partial<IDeviceInfo>;
  userAgent?: string;

  // Risk assessment
  riskScore?: number;
  riskFactors?: string[];
  isSuspicious?: boolean;

  // Timing
  attemptedAt: Date;
  expiresAt: Date;

  // Session (if login was successful)
  sessionId?: Types.ObjectId;
}
