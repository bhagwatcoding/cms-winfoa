/**
 * API Key Interfaces
 * Type definitions for API key management
 */

import { Document, Types } from 'mongoose';
import { ApiKeyScope, ApiKeyEnvironment } from '@/core/db/enums';

// Re-export enums for convenience
export { ApiKeyScope, ApiKeyEnvironment };

// ==========================================
// INTERFACE
// ==========================================

export interface IApiKey extends Document {
  userId: Types.ObjectId;

  // Identification
  name: string;
  description?: string;

  // Key (only prefix and hash stored)
  keyPrefix: string;
  keyHash: string;

  // Configuration - stored as numbers
  environment: ApiKeyEnvironment;
  scopes: ApiKeyScope[];
  permissions: string[];

  // Limits
  rateLimit: number;
  dailyLimit?: number;

  // Restrictions
  allowedIps?: string[];
  allowedDomains?: string[];
  allowedOrigins?: string[];

  // Usage tracking
  usageCount: number;
  lastUsedAt?: Date;
  lastUsedIp?: string;

  // Status
  isActive: boolean;
  expiresAt?: Date;
  revokedAt?: Date;
  revokedBy?: Types.ObjectId;
  revokedReason?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  hasScope(scope: ApiKeyScope): boolean;
  hasPermission(permission: string): boolean;
  isExpired(): boolean;
}
