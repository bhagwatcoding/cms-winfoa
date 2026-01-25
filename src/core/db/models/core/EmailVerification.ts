import mongoose, { Schema, Document, Model, model, models } from 'mongoose';
import crypto from 'crypto';

// ==========================================
// EMAIL VERIFICATION MODEL
// Email verification token management
// ==========================================

export interface IEmailVerification extends Document {
  userId: mongoose.Types.ObjectId;
  email: string; // The email being verified

  // Token (stored as hash)
  tokenHash: string;

  // Timing
  expiresAt: Date;
  verifiedAt?: Date;

  // Status
  isVerified: boolean;
  isRevoked: boolean;

  // Attempts tracking
  verificationAttempts: number;
  lastAttemptAt?: Date;

  // Timestamps
  createdAt: Date;
}

// Static methods
interface IEmailVerificationModel extends Model<IEmailVerification> {
  createToken(
    userId: mongoose.Types.ObjectId,
    email: string
  ): Promise<{ token: string; record: IEmailVerification }>;
  findByToken(token: string): Promise<IEmailVerification | null>;
  verifyEmail(token: string): Promise<IEmailVerification | null>;
  invalidateAllForUser(userId: mongoose.Types.ObjectId): Promise<void>;
  isEmailVerified(userId: mongoose.Types.ObjectId, email: string): Promise<boolean>;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    verifiedAt: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },

    verificationAttempts: {
      type: Number,
      default: 0,
    },
    lastAttemptAt: Date,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'email_verifications',
  }
);

// ==========================================
// INDEXES
// ==========================================

// TTL index for auto-cleanup (keep verified records for 30 days)
EmailVerificationSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isVerified: false },
  }
);

// Compound index for user + email lookups
EmailVerificationSchema.index({ userId: 1, email: 1 });

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ==========================================
// STATIC METHODS
// ==========================================

EmailVerificationSchema.statics.createToken = async function (
  userId: mongoose.Types.ObjectId,
  email: string
): Promise<{ token: string; record: IEmailVerification }> {
  // Invalidate any existing tokens for this user + email
  await this.updateMany(
    { userId, email, isVerified: false, isRevoked: false },
    { isRevoked: true }
  );

  // Generate new token
  const token = generateToken();
  const tokenHash = hashToken(token);

  const record = await this.create({
    userId,
    email,
    tokenHash,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  return { token, record };
};

EmailVerificationSchema.statics.findByToken = async function (
  token: string
): Promise<IEmailVerification | null> {
  const tokenHash = hashToken(token);

  const record = await this.findOne({
    tokenHash,
    isVerified: false,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });

  return record;
};

EmailVerificationSchema.statics.verifyEmail = async function (
  token: string
): Promise<IEmailVerification | null> {
  const tokenHash = hashToken(token);

  const record = await this.findOneAndUpdate(
    {
      tokenHash,
      isVerified: false,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    },
    {
      isVerified: true,
      verifiedAt: new Date(),
      $inc: { verificationAttempts: 1 },
      lastAttemptAt: new Date(),
    },
    { new: true }
  );

  return record;
};

EmailVerificationSchema.statics.invalidateAllForUser = async function (
  userId: mongoose.Types.ObjectId
): Promise<void> {
  await this.updateMany({ userId, isVerified: false, isRevoked: false }, { isRevoked: true });
};

EmailVerificationSchema.statics.isEmailVerified = async function (
  userId: mongoose.Types.ObjectId,
  email: string
): Promise<boolean> {
  const record = await this.findOne({
    userId,
    email,
    isVerified: true,
  });
  return !!record;
};

// ==========================================
// INSTANCE METHODS
// ==========================================

EmailVerificationSchema.methods.isValid = function (): boolean {
  return !this.isVerified && !this.isRevoked && this.expiresAt > new Date();
};

EmailVerificationSchema.methods.recordAttempt = async function (): Promise<void> {
  this.verificationAttempts += 1;
  this.lastAttemptAt = new Date();
  await this.save();
};

// ==========================================
// EXPORT
// ==========================================

export default (models.EmailVerification as IEmailVerificationModel) ||
  model<IEmailVerification, IEmailVerificationModel>('EmailVerification', EmailVerificationSchema);
