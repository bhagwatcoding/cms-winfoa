/**
 * Wallet Transaction Model
 * Combines schema with model export
 */

import { Model, model, models } from 'mongoose';
import { WalletTransactionSchema } from '@/core/db/schemas';
import { IWalletTransaction } from '@/core/db/interfaces';
import { TransactionType, TransactionStatus } from '@/core/db/enums';

// ==========================================
// STATIC METHODS INTERFACE
// ==========================================

interface IWalletTransactionModel extends Model<IWalletTransaction> {
  findByUser(userId: string): Promise<IWalletTransaction[]>;
  findByType(userId: string, type: TransactionType): Promise<IWalletTransaction[]>;
  findByStatus(userId: string, status: TransactionStatus): Promise<IWalletTransaction[]>;
  getTransactionStats(userId: string): Promise<{
    totalTransactions: number;
    totalAmount: number;
    byType: Array<{ type: number; amount: number; count: number }>;
  }>;
}

// ==========================================
// EXPORT
// ==========================================

export type { IWalletTransaction };

export default (models.WalletTransaction as IWalletTransactionModel) ||
  model<IWalletTransaction, IWalletTransactionModel>('WalletTransaction', WalletTransactionSchema);
