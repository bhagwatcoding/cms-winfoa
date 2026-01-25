import { Document, Types } from 'mongoose';
import { TransactionType, TransactionStatus } from '@/core/db/enums';

export interface IWallet extends Document {
  userId: Types.ObjectId;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWalletTransaction extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  transactionId: Types.ObjectId;
  description?: string;
  paymentMethod?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
