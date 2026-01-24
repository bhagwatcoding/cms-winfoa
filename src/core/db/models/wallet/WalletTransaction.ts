import mongoose, { Schema, Document, Model, model, models } from "mongoose";
import { IWalletTransaction, TRANSACTION_TYPE, TRANSACTION_STATUS } from "@/shared/types";

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
      index: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
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
  }
);

// Indexes for common queries
WalletTransactionSchema.index({ userId: 1, createdAt: -1 }); // User transactions sorted by date
WalletTransactionSchema.index({ userId: 1, type: 1 }); // User transactions by type
WalletTransactionSchema.index({ userId: 1, status: 1 }); // User transactions by status
WalletTransactionSchema.index({ createdAt: -1 }); // All transactions sorted by date

// Static methods
WalletTransactionSchema.statics.findByUser = function (userId: string) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.findByType = function (userId: string, type: TRANSACTION_TYPE) {
  return this.find({ userId, type }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.findByStatus = function (userId: string, status: TRANSACTION_STATUS) {
  return this.find({ userId, status }).sort({ createdAt: -1 });
};

WalletTransactionSchema.statics.getTransactionStats = async function (userId: string) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        byType: {
          $push: {
            type: "$type",
            amount: "$amount",
            count: 1,
          },
        },
      },
    },
  ]);

  return stats[0] || { totalTransactions: 0, totalAmount: 0, byType: [] };
};

export default (models.WalletTransaction as Model<IWalletTransaction>) ||
  model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema);