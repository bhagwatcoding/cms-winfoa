import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    isMobile?: boolean;
    device?: string;
  };
  isActive: boolean;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Session expires after 7 days
const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    deviceInfo: {
      browser: { type: String },
      os: { type: String },
      isMobile: { type: Boolean, default: false },
      device: { type: String },
    },
    isActive: { type: Boolean, default: true },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Indexes for performance
SessionSchema.index({ token: 1 }, { unique: true });
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ expiresAt: 1 });
SessionSchema.index({ lastAccessedAt: -1 });

// Auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to cleanup expired sessions
SessionSchema.statics.cleanupExpired = async function (): Promise<number> {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
  return result.deletedCount || 0;
};

export default models.Session<ISession> || model<ISession>("Session", SessionSchema);
