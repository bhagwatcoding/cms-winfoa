import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetToken extends Document {
    email: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

// Token expires after 1 hour
const PasswordResetTokenSchema: Schema = new Schema({
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Auto-delete expired tokens
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);
