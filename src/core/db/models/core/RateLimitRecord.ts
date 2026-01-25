import { Schema, Document, Model, model, models } from 'mongoose';

// ==========================================
// RATE LIMIT RECORD MODEL
// Store rate limiting data in DB (fallback for Redis)
// ==========================================

export enum RateLimitType {
  IP = 'ip',
  USER = 'user',
  API_KEY = 'api_key',
  EMAIL = 'email',
  ENDPOINT = 'endpoint',
}

export interface IRateLimitRecord extends Document {
  // Identification
  key: string; // Unique identifier "ip:192.168.1.1:login" or "user:123:api"
  type: RateLimitType;

  // Counter
  count: number;
  windowStart: Date;
  windowEnd: Date;

  // Blocking
  blocked: boolean;
  blockedUntil?: Date;
  blockedReason?: string;

  // Metadata
  identifier?: string; // IP, user ID, email, etc.
  endpoint?: string;
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Static methods
interface IRateLimitRecordModel extends Model<IRateLimitRecord> {
  check(params: { key: string; type: RateLimitType; limit: number; windowMs: number }): Promise<{
    allowed: boolean;
    current: number;
    remaining: number;
    resetAt: Date;
  }>;
  increment(key: string, type: RateLimitType, windowMs: number): Promise<IRateLimitRecord>;
  isBlocked(key: string): Promise<boolean>;
  block(key: string, duration: number, reason?: string): Promise<void>;
  unblock(key: string): Promise<void>;
  cleanup(): Promise<number>;
  getStats(type?: RateLimitType): Promise<{
    total: number;
    blocked: number;
    byType: Record<string, number>;
  }>;
}

const RateLimitRecordSchema = new Schema<IRateLimitRecord>(
  {
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(RateLimitType),
      required: true,
      index: true,
    },

    count: {
      type: Number,
      default: 0,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    windowEnd: {
      type: Date,
      required: true,
      index: true,
    },

    blocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    blockedUntil: {
      type: Date,
      index: true,
    },
    blockedReason: String,

    identifier: String,
    endpoint: String,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: true,
    collection: 'rate_limit_records',
  }
);

// ==========================================
// INDEXES
// ==========================================

// Compound indexes
RateLimitRecordSchema.index({ type: 1, blocked: 1 });
RateLimitRecordSchema.index({ key: 1, windowEnd: 1 });

// TTL index - cleanup expired windows after 1 hour
RateLimitRecordSchema.index({ windowEnd: 1 }, { expireAfterSeconds: 3600 });

// ==========================================
// STATIC METHODS
// ==========================================

RateLimitRecordSchema.statics.check = async function (params: {
  key: string;
  type: RateLimitType;
  limit: number;
  windowMs: number;
}): Promise<{
  allowed: boolean;
  current: number;
  remaining: number;
  resetAt: Date;
}> {
  const { key, type, limit, windowMs } = params;
  const now = new Date();

  // First check if blocked
  const existing = await this.findOne({ key });

  if (existing?.blocked && existing.blockedUntil && existing.blockedUntil > now) {
    return {
      allowed: false,
      current: limit,
      remaining: 0,
      resetAt: existing.blockedUntil,
    };
  }

  // Increment and get current count
  const record = await (this as IRateLimitRecordModel).increment(key, type, windowMs);

  const allowed = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);

  return {
    allowed,
    current: record.count,
    remaining,
    resetAt: record.windowEnd,
  };
};

RateLimitRecordSchema.statics.increment = async function (
  key: string,
  type: RateLimitType,
  windowMs: number
): Promise<IRateLimitRecord> {
  const now = new Date();
  const windowStart = now;
  const windowEnd = new Date(now.getTime() + windowMs);

  const record = await this.findOneAndUpdate(
    {
      key,
      windowEnd: { $gt: now }, // Only update if window is still active
    },
    {
      $inc: { count: 1 },
      $setOnInsert: {
        type,
        windowStart,
        windowEnd,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  // If we got an expired window, reset it
  if (record.windowEnd <= now) {
    return this.findOneAndUpdate(
      { key },
      {
        count: 1,
        windowStart: now,
        windowEnd,
        type,
      },
      { new: true }
    );
  }

  return record;
};

RateLimitRecordSchema.statics.isBlocked = async function (key: string): Promise<boolean> {
  const record = await this.findOne({ key, blocked: true });
  if (!record) return false;

  // Check if block has expired
  if (record.blockedUntil && record.blockedUntil <= new Date()) {
    await (this as IRateLimitRecordModel).unblock(key);
    return false;
  }

  return true;
};

RateLimitRecordSchema.statics.block = async function (
  key: string,
  duration: number,
  reason?: string
): Promise<void> {
  const blockedUntil = new Date(Date.now() + duration);

  await this.findOneAndUpdate(
    { key },
    {
      blocked: true,
      blockedUntil,
      blockedReason: reason,
    },
    { upsert: true }
  );
};

RateLimitRecordSchema.statics.unblock = async function (key: string): Promise<void> {
  await this.findOneAndUpdate(
    { key },
    {
      blocked: false,
      $unset: { blockedUntil: 1, blockedReason: 1 },
    }
  );
};

RateLimitRecordSchema.statics.cleanup = async function (): Promise<number> {
  const now = new Date();
  const result = await this.deleteMany({
    windowEnd: { $lt: now },
    blocked: false,
  });
  return result.deletedCount;
};

RateLimitRecordSchema.statics.getStats = async function (type?: RateLimitType): Promise<{
  total: number;
  blocked: number;
  byType: Record<string, number>;
}> {
  const match = type ? { type } : {};

  const [stats] = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        blocked: { $sum: { $cond: ['$blocked', 1, 0] } },
      },
    },
  ]);

  const byTypeResult = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const byType: Record<string, number> = {};
  byTypeResult.forEach((item) => {
    byType[item._id] = item.count;
  });

  return {
    total: stats?.total ?? 0,
    blocked: stats?.blocked ?? 0,
    byType,
  };
};

// ==========================================
// EXPORT
// ==========================================

export default (models.RateLimitRecord as IRateLimitRecordModel) ||
  model<IRateLimitRecord, IRateLimitRecordModel>('RateLimitRecord', RateLimitRecordSchema);
