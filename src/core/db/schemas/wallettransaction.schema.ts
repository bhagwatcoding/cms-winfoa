/**
 * Wallet Transaction Schema
 * Mongoose schema definition for wallet transactions
 */

import mongoose, { Schema } from 'mongoose';
import { IWalletTransaction } from '@/core/db/interfaces/wallet.interface';
import { TransactionType, TransactionStatus } from '@/core/db/enums';

export const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: Number,
      required: true,
      index: true,
      min: 1,
      max: 30,
    },
    status: {
      type: Number,
      default: TransactionStatus.Pending,
      index: true,
      min: 1,
      max: 25,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true, // unique automatically creates an index
    },
    description: {
      type: String,
      maxlength: 500,
    },
    paymentMethod: {
      type: String,
      maxlength: 50,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'wallet_transactions',
  }
);

// Indexes
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ userId: 1, type: 1 });
WalletTransactionSchema.index({ userId: 1, status: 1 });
WalletTransactionSchema.index({ createdAt: -1 });

// Static methods
WalletTransactionSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.findByType = function (userId: string, type: TransactionType) {
  return this.find({ userId, type }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.findByStatus = function (
  userId: string,
  status: TransactionStatus
) {
  return this.find({ userId, status }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.getTransactionStats = async function (userId: string) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        byType: {
          $push: {
            type: '$type',
            amount: '$amount',
            count: 1,
          },
        },
      },
    },
  ]);

  return stats[0] || { totalTransactions: 0, totalAmount: 0, byType: [] };
};
