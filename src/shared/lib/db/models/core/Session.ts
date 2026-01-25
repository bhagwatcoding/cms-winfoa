import mongoose, { Schema, Document, Model, model, models } from 'mongoose';
import { DeviceType, LoginMethod, RiskLevel, SessionStatus } from '@/types';

// Interface definitions to match the schema structure
interface IDeviceInfo {
  browser?: string;
  os?: string;
  device?: string;
  type?: DeviceType;
  isMobile?: boolean;
  deviceId?: string;
}

interface IGeoInfo {
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  timezone?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
  isp?: string;
}

interface ISecurityInfo {
  loginMethod?: LoginMethod;
  riskScore?: number;
  riskLevel?: RiskLevel;
  isVerified?: boolean;
  failedAttempts?: number;
}

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;

  deviceInfo?: IDeviceInfo;
  geoInfo?: IGeoInfo;
  securityInfo?: ISecurityInfo;

  isActive: boolean;
  status?: SessionStatus;

  lastAccessedAt: Date;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
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
      device: String,
      type: { type: Number, enum: DeviceType, default: DeviceType.Unknown },
      isMobile: { type: Boolean, default: false },
      deviceId: String,
    },
    // 🆕 Geo Location Data
    geoInfo: {
      ip: String,
      country: String,
      countryCode: String,
      city: String,
      timezone: String,
      coordinates: {
        lat: Number,
        long: Number,
      },
      isp: String,
    },
    securityInfo: {
      loginMethod: {
        type: Number,
        enum: LoginMethod,
        default: LoginMethod.Password,
      },
      riskScore: { type: Number, default: 0 },
      riskLevel: { type: Number, enum: RiskLevel, default: RiskLevel.Low },
      isVerified: { type: Boolean, default: false },
      failedAttempts: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true },
    status: {
      type: Number,
      enum: SessionStatus,
      default: SessionStatus.Active,
    },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-delete hard expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default (models.Session as Model<ISession>) || model<ISession>('Session', SessionSchema);
