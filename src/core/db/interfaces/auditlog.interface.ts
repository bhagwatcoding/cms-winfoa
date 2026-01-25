/**
 * Audit Log Interfaces
 * Type definitions for audit logging (GDPR/SOC2)
 */

import { Document, Types } from 'mongoose';
import { IGeoInfo, IDeviceInfo } from './core.interface';
import { AuditSeverity, AuditCategory } from '@/core/db/enums';

// Re-export enums for convenience
export { AuditSeverity, AuditCategory };

// ==========================================
// SUB-INTERFACES
// ==========================================

export interface IAuditActor {
  userId?: Types.ObjectId;
  email?: string;
  name?: string;
  role?: string;
  ip?: string;
  isSystem?: boolean;
}

export interface IAuditTarget {
  model?: string;
  documentId?: string;
  field?: string;
  previousValue?: unknown;
  newValue?: unknown;
  changes?: Record<string, { from: unknown; to: unknown }>;
}

export interface IAuditContext {
  requestId?: string;
  sessionId?: string;
  userAgent?: string;
  duration?: number;
  source?: string;
}

// ==========================================
// MAIN INTERFACE
// ==========================================

export interface IAuditLog extends Document {
  // Event identification
  eventType: string;
  category: AuditCategory; // Stored as number
  severity: AuditSeverity; // Stored as number

  // Actor (who did it)
  actor: IAuditActor;

  // Target (what was affected)
  target?: IAuditTarget;

  // Context
  context?: IAuditContext;
  geoInfo?: IGeoInfo;
  deviceInfo?: Partial<IDeviceInfo>;

  // Message
  message: string;
  details?: Record<string, unknown>;

  // Immutability
  checksumHash?: string;

  // Timestamps
  timestamp: Date;
  expiresAt?: Date;
}
