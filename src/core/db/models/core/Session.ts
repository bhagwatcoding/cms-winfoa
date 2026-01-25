import { Schema, Model, model, models } from 'mongoose';
import { SessionStatus } from '@/core/db/enums';
import { ISession } from '@/core/db/interfaces';

// ==========================================
// SESSION MODEL
// ==========================================

const SessionSchema = new Schema<ISession>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },

    deviceInfo: {
      browser: String,
      os: String,
      type: Number,
      device: Number,
      isMobile: Boolean,
      deviceId: String,
      name: String,
      ip: String,
      userAgent: String,
    },

    geoInfo: {
      ip: String,
      city: String,
      country: String,
      region: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      timezone: String,
    },

    securityInfo: {
      isSecure: Boolean,
      isTor: Boolean,
      isProxy: Boolean,
      isDatacenter: Boolean,
      riskLevel: Number,
      riskScore: Number,
    },

    isActive: { type: Boolean, default: true },

    status: {
      type: Number,
      enum: Object.values(SessionStatus).filter((v) => typeof v === 'number'),
      default: SessionStatus.Active,
    },

    isValid: { type: Boolean, default: true },
    lastAccessedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-delete hard expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default (models.Session as Model<ISession>) || model<ISession>('Session', SessionSchema);
