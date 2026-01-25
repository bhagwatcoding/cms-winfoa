/**
 * API Key Model
 * Combines schema with model export and static methods
 */

import { Model, model, models, Types } from 'mongoose';
import crypto from 'crypto';
import { ApiKeySchema } from '@/core/db/schemas';
import { IApiKey, ApiKeyScope, ApiKeyEnvironment } from '@/core/db/interfaces';

// ==========================================
// STATIC METHODS INTERFACE
// ==========================================

interface IApiKeyModel extends Model<IApiKey> {
  generate(params: {
    userId: Types.ObjectId;
    name: string;
    environment?: ApiKeyEnvironment;
    scopes?: ApiKeyScope[];
    permissions?: string[];
    rateLimit?: number;
    allowedIps?: string[];
    allowedDomains?: string[];
    expiresAt?: Date;
  }): Promise<{ key: string; record: IApiKey }>;
  findByKey(key: string): Promise<IApiKey | null>;
  validateKey(
    key: string,
    requiredScope?: ApiKeyScope
  ): Promise<{
    valid: boolean;
    apiKey?: IApiKey;
    reason?: string;
  }>;
  getByUser(userId: Types.ObjectId): Promise<IApiKey[]>;
  revoke(
    keyId: Types.ObjectId,
    revokedBy: Types.ObjectId,
    reason?: string
  ): Promise<IApiKey | null>;
  recordUsage(keyId: Types.ObjectId, ip?: string): Promise<void>;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generateApiKey(environment: ApiKeyEnvironment): string {
  const prefix = `wf_${environment}_`;
  const key = crypto.randomBytes(24).toString('base64url');
  return `${prefix}${key}`;
}

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function getKeyPrefix(key: string): string {
  return key.substring(0, 20) + '...';
}

// ==========================================
// STATIC METHODS
// ==========================================

ApiKeySchema.statics.generate = async function (params: {
  userId: Types.ObjectId;
  name: string;
  environment?: ApiKeyEnvironment;
  scopes?: ApiKeyScope[];
  permissions?: string[];
  rateLimit?: number;
  allowedIps?: string[];
  allowedDomains?: string[];
  expiresAt?: Date;
}): Promise<{ key: string; record: IApiKey }> {
  const environment = params.environment ?? ApiKeyEnvironment.TEST;
  const key = generateApiKey(environment);
  const keyHash = hashKey(key);
  const keyPrefix = getKeyPrefix(key);

  const record = await this.create({
    ...params,
    environment,
    keyPrefix,
    keyHash,
    scopes: params.scopes ?? [ApiKeyScope.READ],
    rateLimit: params.rateLimit ?? 60,
  });

  return { key, record };
};

ApiKeySchema.statics.findByKey = async function (key: string): Promise<IApiKey | null> {
  const keyHash = hashKey(key);
  return this.findOne({ keyHash, isActive: true });
};

ApiKeySchema.statics.validateKey = async function (
  key: string,
  requiredScope?: ApiKeyScope
): Promise<{ valid: boolean; apiKey?: IApiKey; reason?: string }> {
  const keyHash = hashKey(key);
  const apiKey = await this.findOne({ keyHash });

  if (!apiKey) return { valid: false, reason: 'API key not found' };

  if (!apiKey.isActive) return { valid: false, reason: 'API key is inactive' };

  if (apiKey.revokedAt) return { valid: false, reason: 'API key has been revoked' };

  if (apiKey.expiresAt && apiKey.expiresAt < new Date())
    return { valid: false, reason: 'API key has expired' };

  if (requiredScope && !apiKey.scopes.includes(requiredScope))
    return { valid: false, reason: `Missing required scope: ${requiredScope}` };

  return { valid: true, apiKey };
};

ApiKeySchema.statics.getByUser = function (userId: Types.ObjectId): Promise<IApiKey[]> {
  return this.find({ userId }).sort({ createdAt: -1 });
};

ApiKeySchema.statics.revoke = async function (
  keyId: Types.ObjectId,
  revokedBy: Types.ObjectId,
  reason?: string
): Promise<IApiKey | null> {
  return this.findByIdAndUpdate(
    keyId,
    {
      isActive: false,
      revokedAt: new Date(),
      revokedBy,
      revokedReason: reason,
    },
    { new: true }
  );
};

ApiKeySchema.statics.recordUsage = async function (
  keyId: Types.ObjectId,
  ip?: string
): Promise<void> {
  await this.findByIdAndUpdate(keyId, {
    $inc: { usageCount: 1 },
    lastUsedAt: new Date(),
    lastUsedIp: ip,
  });
};

// ==========================================
// EXPORT
// ==========================================

export type { IApiKey };
export { ApiKeyScope, ApiKeyEnvironment };

export default (models.ApiKey as IApiKeyModel) ||
  model<IApiKey, IApiKeyModel>('ApiKey', ApiKeySchema);
