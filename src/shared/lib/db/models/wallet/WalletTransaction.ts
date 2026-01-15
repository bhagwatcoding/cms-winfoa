// Temporary stub for deleted model - WalletTransaction uses Transaction model instead
// This is a placeholder to prevent build errors  
import { Schema, model, models } from 'mongoose';
export type { IWalletTransaction } from '@/types/models';

const walletTransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    type: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Add static method for compatibility
walletTransactionSchema.statics.createTransaction = async function (data: any) {
    return this.create(data);
};

export default models.WalletTransaction || model('WalletTransaction', walletTransactionSchema);

