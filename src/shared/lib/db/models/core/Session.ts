import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import {
  DeviceType,
  LoginMethod,
  RiskLevel,
  SessionStatus,
  IDeviceInfo,
  ISecurityInfo,
  IGeoInfo,
} from "@/types";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;

  deviceInfo: IDeviceInfo;
  geoInfo: IGeoInfo;
  securityInfo: ISecurityInfo;

  isActive: boolean;
  status: SessionStatus;

  lastAccessedAt: Date;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },

    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      type: { type: Number, enum: DeviceType, default: DeviceType.UNKNOWN },
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
        default: LoginMethod.PASSWORD,
      },
      riskScore: { type: Number, default: 0 },
      riskLevel: { type: Number, enum: RiskLevel, default: RiskLevel.LOW },
      isVerified: { type: Boolean, default: false },
      failedAttempts: { type: Number, default: 0 },
    },

    isActive: { type: Boolean, default: true },
    status: {
      type: Number,
      enum: SessionStatus,
      default: SessionStatus.ACTIVE,
    },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Auto-delete hard expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default (models.Session as Model<ISession>) ||
  model<ISession>("Session", SessionSchema);
