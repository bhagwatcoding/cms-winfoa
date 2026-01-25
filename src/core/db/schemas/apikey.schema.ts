/**
 * API Key Schema
 * Mongoose schema definition for API keys
 * Uses numeric enums for efficient storage
 */

import { Schema } from 'mongoose';
import { IApiKey } from '@/core/db/interfaces';
import {
  ApiKeyScope,
  ApiKeyEnvironment,
  ApiKeyEnvironmentLabel,
  getEnumRange,
} from '@/core/db/enums';

export const ApiKeySchema = new Schema<IApiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    name: {
      type: String,
      required: [true, 'API key name is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    keyPrefix: {
      type: String,
      required: true,
      index: true,
    },
    keyHash: {
      type: String,
      required: true,
      unique: true,
    },

    // Stored as number for efficiency
    environment: {
      type: Number,
      default: ApiKeyEnvironment.TEST,
      min: getEnumRange(ApiKeyEnvironmentLabel).min,
      max: getEnumRange(ApiKeyEnvironmentLabel).max,
      index: true,
    },
    scopes: {
      type: [Number],
      default: [ApiKeyScope.READ],
    },
    permissions: {
      type: [String],
      default: [],
    },

    rateLimit: {
      type: Number,
      default: 60,
      min: 1,
      max: 10000,
    },
    dailyLimit: {
      type: Number,
      min: 1,
    },

    allowedIps: {
      type: [String],
      default: [],
    },
    allowedDomains: {
      type: [String],
      default: [],
    },
    allowedOrigins: {
      type: [String],
      default: [],
    },

    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedAt: Date,
    lastUsedIp: String,

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    revokedAt: Date,
    revokedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    revokedReason: String,
  },
  {
    timestamps: true,
    collection: 'api_keys',
  }
);

// Indexes
ApiKeySchema.index({ userId: 1, isActive: 1 });

// Instance Methods
ApiKeySchema.methods.hasScope = function (scope: ApiKeyScope): boolean {
  return this.scopes.includes(scope) || this.scopes.includes(ApiKeyScope.ADMIN);
};

ApiKeySchema.methods.hasPermission = function (permission: string): boolean {
  return (
    this.permissions.length === 0 ||
    this.permissions.includes(permission) ||
    this.permissions.includes('*')
  );
};

ApiKeySchema.methods.isExpired = function (): boolean {
  return !!this.expiresAt && this.expiresAt < new Date();
};
