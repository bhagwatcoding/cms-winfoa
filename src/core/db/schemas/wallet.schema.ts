/**
 * Wallet Schema
 * Mongoose schema definition for user wallets
 */

import { Schema } from 'mongoose';
import { IWallet } from '@/core/db/interfaces';

export const WalletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // unique creates index automatically
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'wallets',
  }
);

// Static methods
WalletSchema.statics.findByUser = function (userId: string) {
  return this.findOne({ userId });
};

WalletSchema.statics.getBalance = async function (userId: string): Promise<number> {
  const wallet = await this.findOne({ userId });
  return wallet?.balance ?? 0;
};

WalletSchema.statics.updateBalance = async function (userId: string, amount: number) {
  return this.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount } },
    { new: true, upsert: true }
  );
};

WalletSchema.statics.setBalance = async function (userId: string, balance: number) {
  return this.findOneAndUpdate({ userId }, { balance }, { new: true, upsert: true });
};
