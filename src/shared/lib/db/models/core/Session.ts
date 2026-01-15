import mongoose, { Schema, Document, model, models } from "mongoose";
import { DeviceType, LoginMethod, RiskLevel, SessionStatus } from "@/types/enums";
import type { IDeviceInfo, ISecurityInfo } from "@/types/auth";

// ==========================================
// INTERFACES
// ==========================================

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;

  // Request metadata
  userAgent?: string;
  ipAddress?: string;
  location?: string; // Geo-location from IP

  // Device information
  deviceInfo?: IDeviceInfo;

  // Security information
  securityInfo?: ISecurityInfo;

  // Session state
  isActive: boolean;
  status: SessionStatus; // Numeric Enum: 1=Active, 2=Expired, etc
  isRememberMe?: boolean; // Remember me session (90 days)

  // Activity tracking
  lastAccessedAt: Date;
  loginAt: Date;

  // Metadata
  notes?: string; // Admin notes
  tags?: string[]; // For categorization

  // Timestamps (auto-managed by mongoose)
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// SCHEMA DEFINITION
// ==========================================

const SessionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // Request metadata
    userAgent: {
      type: String,
      maxlength: 500,
    },
    ipAddress: {
      type: String,
      maxlength: 45, // IPv6 max length
      index: true,
    },
    location: {
      type: String,
      maxlength: 200,
    },

    // Device information
    deviceInfo: {
      browser: { type: String, maxlength: 50 },
      os: { type: String, maxlength: 50 },
      device: { type: String, maxlength: 50 },
      type: {
        type: Number,
        enum: Object.values(DeviceType).filter(v => typeof v === 'number'),
        default: DeviceType.UNKNOWN
      },
      isMobile: { type: Boolean, default: false },
      deviceId: { type: String, maxlength: 100 },
    },

    // Security information
    securityInfo: {
      loginMethod: {
        type: Number,
        enum: Object.values(LoginMethod).filter(v => typeof v === 'number'),
        default: LoginMethod.PASSWORD,
      },
      riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      riskLevel: {
        type: Number,
        enum: Object.values(RiskLevel).filter(v => typeof v === 'number'),
        default: RiskLevel.LOW
      },
      isVerified: { type: Boolean, default: false },
      failedAttempts: { type: Number, default: 0 },
    },

    // Session state
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: Number,
      enum: Object.values(SessionStatus).filter(v => typeof v === 'number'),
      default: SessionStatus.ACTIVE,
      index: true,
    },
    isRememberMe: {
      type: Boolean,
      default: false,
    },

    // Activity tracking
    lastAccessedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    loginAt: {
      type: Date,
      default: Date.now,
    },

    // Metadata
    notes: { type: String, maxlength: 1000 },
    tags: [{ type: String, maxlength: 50 }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'sessions',
  }
);

// ==========================================
// INDEXES
// ==========================================

// Unique token index
SessionSchema.index({ token: 1 }, { unique: true });

// Compound indexes for common queries
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ userId: 1, expiresAt: 1 });
SessionSchema.index({ userId: 1, lastAccessedAt: -1 });
SessionSchema.index({ userId: 1, status: 1 }); // New index for status

// Performance indexes
SessionSchema.index({ expiresAt: 1 });
SessionSchema.index({ lastAccessedAt: -1 });
SessionSchema.index({ createdAt: -1 });

// Security indexes
SessionSchema.index({ ipAddress: 1, userId: 1 });
SessionSchema.index({ 'deviceInfo.deviceId': 1 });

// TTL index - Auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ==========================================
// VIRTUAL FIELDS
// ==========================================

// Check if session is expired
SessionSchema.virtual('isExpired').get(function (this: ISession) {
  return this.expiresAt < new Date();
});

// Get session age in days
SessionSchema.virtual('ageInDays').get(function (this: ISession) {
  const now = new Date();
  const created = this.createdAt;
  const diffMs = now.getTime() - created.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

// Get time until expiry
SessionSchema.virtual('expiresIn').get(function (this: ISession) {
  const now = new Date();
  const diffMs = this.expiresAt.getTime() - now.getTime();
  return Math.max(0, diffMs);
});

// ==========================================
// INSTANCE METHODS
// ==========================================

/**
 * Update last accessed time
 */
SessionSchema.methods.updateLastAccessed = async function (this: ISession) {
  this.lastAccessedAt = new Date();
  return this.save();
};

/**
 * Deactivate session
 */
SessionSchema.methods.deactivate = async function (this: ISession) {
  this.isActive = false;
  this.status = SessionStatus.INACTIVE;
  return this.save();
};

/**
 * Extend expiration
 */
SessionSchema.methods.extend = async function (
  this: ISession,
  durationMs: number
) {
  this.expiresAt = new Date(Date.now() + durationMs);
  return this.save();
};

/**
 * Mark as verified (e.g., after 2FA)
 */
SessionSchema.methods.markVerified = async function (this: ISession) {
  if (this.securityInfo) {
    this.securityInfo.isVerified = true;
  } else {
    this.securityInfo = { isVerified: true };
  }
  return this.save();
};

/**
 * Get formatted session info for display
 */
SessionSchema.methods.toDisplay = function (this: ISession) {
  return {
    id: this._id.toString(),
    device: `${this.deviceInfo?.device || 'Unknown'} - ${this.deviceInfo?.browser || 'Unknown'}`,
    os: this.deviceInfo?.os || 'Unknown',
    location: this.location || this.ipAddress || 'Unknown',
    lastActive: this.lastAccessedAt,
    loginAt: this.loginAt,
    isActive: this.isActive,
    status: this.status, // Return status enum
    isCurrent: false, // Set externally by comparing tokens
    expiresAt: this.expiresAt,
  };
};

// ==========================================
// STATIC METHODS
// ==========================================

/**
 * Cleanup expired sessions
 */
SessionSchema.statics.cleanupExpired = async function (): Promise<number> {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount || 0;
};

/**
 * Cleanup inactive sessions
 */
SessionSchema.statics.cleanupInactive = async function (
  daysInactive: number = 30
): Promise<number> {
  const inactiveDate = new Date(Date.now() - daysInactive * 24 * 60 * 60 * 1000);

  const result = await this.deleteMany({
    lastAccessedAt: { $lt: inactiveDate },
  });
  return result.deletedCount || 0;
};

/**
 * Get active sessions count for user
 */
SessionSchema.statics.getActiveCount = async function (
  userId: string
): Promise<number> {
  return this.countDocuments({
    userId,
    isActive: true, // Legacy check
    status: SessionStatus.ACTIVE, // New check
    expiresAt: { $gt: new Date() },
  });
};

/**
 * Get sessions by IP address
 */
SessionSchema.statics.getByIpAddress = async function (
  ipAddress: string
): Promise<ISession[]> {
  return this.find({
    ipAddress,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
};

/**
 * Get sessions by device ID
 */
SessionSchema.statics.getByDeviceId = async function (
  deviceId: string
): Promise<ISession[]> {
  return this.find({
    'deviceInfo.deviceId': deviceId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
};

/**
 * Revoke all sessions for user
 */
SessionSchema.statics.revokeAllForUser = async function (
  userId: string
): Promise<number> {
  const result = await this.updateMany(
    { userId },
    {
      isActive: false,
      status: SessionStatus.REVOKED
    }
  );
  return result.modifiedCount || 0;
};

/**
 * Get session statistics
 */
SessionSchema.statics.getStats = async function (userId?: string) {
  const filter = userId ? { userId } : {};

  const [total, active, expired, inactive] = await Promise.all([
    this.countDocuments(filter),
    this.countDocuments({
      ...filter,
      isActive: true,
      expiresAt: { $gt: new Date() },
    }),
    this.countDocuments({
      ...filter,
      expiresAt: { $lt: new Date() },
    }),
    this.countDocuments({
      ...filter,
      isActive: false,
    }),
  ]);

  return { total, active, expired, inactive };
};

// ==========================================
// PRE/POST HOOKS
// ==========================================

// Before save: Update lastAccessedAt and Status if session is being used
SessionSchema.pre('save', async function (this: ISession) {
  // If this is a new document, set loginAt
  if (this.isNew) {
    if (!this.loginAt) this.loginAt = new Date();
    if (this.status === undefined) this.status = SessionStatus.ACTIVE;
  }
});

// ==========================================
// MODEL EXPORT
// ==========================================

// Add type for static methods
interface ISessionModel extends mongoose.Model<ISession> {
  cleanupExpired(): Promise<number>;
  cleanupInactive(daysInactive?: number): Promise<number>;
  getActiveCount(userId: string): Promise<number>;
  getByIpAddress(ipAddress: string): Promise<ISession[]>;
  getByDeviceId(deviceId: string): Promise<ISession[]>;
  revokeAllForUser(userId: string): Promise<number>;
  getStats(userId?: string): Promise<{
    total: number;
    active: number;
    expired: number;
    inactive: number;
  }>;
}

export default (models.Session as ISessionModel) || model<ISession, ISessionModel>("Session", SessionSchema);
