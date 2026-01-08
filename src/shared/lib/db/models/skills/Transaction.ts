import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    centerId: mongoose.Types.ObjectId;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
    paymentMethod?: string;
    transactionId: string;
    balance: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransactionModel extends Model<ITransaction> {
    getUserBalance(userId: string): Promise<{ balance: number; credit: number; debit: number }>;
    createTransaction(data: {
        userId: string;
        centerId: string;
        type: 'credit' | 'debit';
        amount: number;
        description: string;
        paymentMethod?: string;
        metadata?: Record<string, any>;
    }): Promise<ITransaction>;
}

const TransactionSchema = new Schema<ITransaction, ITransactionModel>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        centerId: {
            type: Schema.Types.ObjectId,
            ref: 'Center',
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
        balance: {
            type: Number,
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ centerId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ type: 1, status: 1 });

// Static method to get user balance
TransactionSchema.statics.getUserBalance = async function (this: ITransactionModel, userId: string) {
    const result = await this.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                status: 'completed',
            },
        },
        {
            $group: {
                _id: null,
                credit: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0],
                    },
                },
                debit: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0],
                    },
                },
            },
        },
        {
            $project: {
                balance: { $subtract: ['$credit', '$debit'] },
                credit: 1,
                debit: 1,
            },
        },
    ]);

    return result[0] || { balance: 0, credit: 0, debit: 0 };
};

// Static method to create transaction
TransactionSchema.statics.createTransaction = async function (this: ITransactionModel, data: {
    userId: string;
    centerId: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    paymentMethod?: string;
    metadata?: Record<string, any>;
}) {
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 11).toUpperCase()}`;

    const currentBalance = await this.getUserBalance(data.userId);
    const newBalance =
        data.type === 'credit'
            ? currentBalance.balance + data.amount
            : currentBalance.balance - data.amount;

    const transaction = await this.create({
        ...data,
        transactionId,
        balance: newBalance,
        status: 'completed',
    });

    return transaction;
};

const Transaction: ITransactionModel =
    (mongoose.models.Transaction as ITransactionModel) || mongoose.model<ITransaction, ITransactionModel>('Transaction', TransactionSchema);

export default Transaction;
