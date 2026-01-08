import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWalletTransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod?: string;
    transactionId: string;
    balanceBefore: number;
    balanceAfter: number;
    referenceId?: string; // For syncing with payment gateway or other systems
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface IWalletTransactionModel extends Model<IWalletTransaction> {
    createTransaction(data: {
        userId: string;
        type: 'credit' | 'debit';
        amount: number;
        description: string;
        paymentMethod?: string;
        referenceId?: string;
        status?: 'completed' | 'pending' | 'failed';
        metadata?: Record<string, unknown>;
    }): Promise<IWalletTransaction>;
}

const WalletTransactionSchema = new Schema<IWalletTransaction, IWalletTransactionModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['completed', 'pending', 'failed'],
            default: 'pending',
            index: true,
        },
        paymentMethod: {
            type: String,
            trim: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        balanceBefore: {
            type: Number,
            required: true,
        },
        balanceAfter: {
            type: Number,
            required: true,
        },
        referenceId: {
            type: String,
            trim: true
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ type: 1, status: 1 });

// Static method to create transaction
WalletTransactionSchema.statics.createTransaction = async function (this: IWalletTransactionModel, data: {
    userId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    paymentMethod?: string;
    referenceId?: string;
    status?: 'completed' | 'pending' | 'failed';
    metadata?: Record<string, unknown>;
}) {
    // Import User model dynamically to avoid circular dependencies if any (though typically fine here)
    const User = mongoose.models.User || mongoose.model('User');

    // Start session for atomic updates usage if we were using transactions, but for now simple await
    // Note: In a real app, use a transaction session for atomicity.

    const user = await User.findById(data.userId);
    if (!user) throw new Error('User not found');

    const currentBalance = user.walletBalance || 0;

    // Check sufficient funds for debit
    if (data.type === 'debit' && currentBalance < data.amount) {
        throw new Error('Insufficient wallet balance');
    }

    const newBalance = data.type === 'credit'
        ? currentBalance + data.amount
        : currentBalance - data.amount;

    // Update user balance
    user.walletBalance = newBalance;
    await user.save();

    const transactionId = `WT${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const transaction = await this.create({
        ...data,
        transactionId,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        status: data.status || 'completed',
    });

    return transaction;
};

const WalletTransaction: IWalletTransactionModel =
    (mongoose.models.WalletTransaction as IWalletTransactionModel) ||
    mongoose.model<IWalletTransaction, IWalletTransactionModel>('WalletTransaction', WalletTransactionSchema);

export default WalletTransaction;
