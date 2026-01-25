/**
 * Wallet Model
 * Combines schema with model export
 */

import { Model, model, models } from 'mongoose';
import { WalletSchema } from '@/core/db/schemas/wallet.schema';
import { IWallet } from '@/core/db/interfaces/wallet.interface';

// ==========================================
// STATIC METHODS INTERFACE
// ==========================================

interface IWalletModel extends Model<IWallet> {
  findByUser(userId: string): Promise<IWallet | null>;
  getBalance(userId: string): Promise<number>;
  updateBalance(userId: string, amount: number): Promise<IWallet>;
  setBalance(userId: string, balance: number): Promise<IWallet>;
}

// ==========================================
// EXPORT
// ==========================================

export type { IWallet };

export default (models.Wallet as IWalletModel) ||
  model<IWallet, IWalletModel>('Wallet', WalletSchema);
