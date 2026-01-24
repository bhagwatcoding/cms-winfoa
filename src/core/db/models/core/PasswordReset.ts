import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import crypto from "crypto";

// ==========================================
// PASSWORD RESET MODEL
// Secure password reset token management
// ==========================================

export interface IPasswordReset extends Document {
    userId: mongoose.Types.ObjectId;
    email: string; // Stored for reference

    // Token (stored as hash)
    tokenHash: string;

    // Timing
    expiresAt: Date;
    usedAt?: Date;

    // Request context
    requestedFromIp?: string;
    requestedFromDevice?: string;
    requestedFromCountry?: string;

    // Status
    isUsed: boolean;
    isRevoked: boolean;

    // Timestamps
    createdAt: Date;
}

// Static methods
interface IPasswordResetModel extends Model<IPasswordReset> {
    createToken(
        userId: mongoose.Types.ObjectId,
        email: string,
        ip?: string,
        device?: string
    ): Promise<{ token: string; record: IPasswordReset }>;
    findByToken(token: string): Promise<IPasswordReset | null>;
    invalidateAllForUser(userId: mongoose.Types.ObjectId): Promise<void>;
    cleanupExpired(): Promise<number>;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
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
        usedAt: Date,

        requestedFromIp: String,
        requestedFromDevice: String,
        requestedFromCountry: String,

        isUsed: {
            type: Boolean,
            default: false,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "password_resets",
    }
);

// ==========================================
// INDEXES
// ==========================================

// TTL index for auto-cleanup
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for finding active tokens
PasswordResetSchema.index({ userId: 1, isUsed: 1, isRevoked: 1 });

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

// ==========================================
// STATIC METHODS
// ==========================================

PasswordResetSchema.statics.createToken = async function (
    userId: mongoose.Types.ObjectId,
    email: string,
    ip?: string,
    device?: string
): Promise<{ token: string; record: IPasswordReset }> {
    // Invalidate any existing tokens for this user
    await this.updateMany(
        { userId, isUsed: false, isRevoked: false },
        { isRevoked: true }
    );

    // Generate new token
    const token = generateToken();
    const tokenHash = hashToken(token);

    const record = await this.create({
        userId,
        email,
        tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        requestedFromIp: ip,
        requestedFromDevice: device,
    });

    return { token, record };
};

PasswordResetSchema.statics.findByToken = async function (
    token: string
): Promise<IPasswordReset | null> {
    const tokenHash = hashToken(token);

    const record = await this.findOne({
        tokenHash,
        isUsed: false,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
    });

    return record;
};

PasswordResetSchema.statics.invalidateAllForUser = async function (
    userId: mongoose.Types.ObjectId
): Promise<void> {
    await this.updateMany(
        { userId, isUsed: false, isRevoked: false },
        { isRevoked: true }
    );
};

PasswordResetSchema.statics.cleanupExpired = async function (): Promise<number> {
    const result = await this.deleteMany({
        expiresAt: { $lt: new Date() },
    });
    return result.deletedCount;
};

// ==========================================
// INSTANCE METHODS
// ==========================================

PasswordResetSchema.methods.use = async function (): Promise<IPasswordReset> {
    this.isUsed = true;
    this.usedAt = new Date();
    return this.save();
};

PasswordResetSchema.methods.isValid = function (): boolean {
    return !this.isUsed && !this.isRevoked && this.expiresAt > new Date();
};

// ==========================================
// EXPORT
// ==========================================

export default (models.PasswordReset as IPasswordResetModel) ||
    model<IPasswordReset, IPasswordResetModel>("PasswordReset", PasswordResetSchema);
