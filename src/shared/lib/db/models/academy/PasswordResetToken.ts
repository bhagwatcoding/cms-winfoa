// Temporary stub for deleted model - PasswordResetToken functionality simplified
// This is a placeholder to prevent build errors
import { Schema, model, models } from 'mongoose';

const passwordResetTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default models.PasswordResetToken || model('PasswordResetToken', passwordResetTokenSchema);
export type { IPasswordResetToken } from '@/types/models/academy.interface';
