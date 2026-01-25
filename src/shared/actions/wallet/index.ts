'use server';

import { connectDB } from '@/core/db';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/core/auth';
import { Notification, NotificationType, User, WalletTransaction } from '@/models';
import { getErrorMessage } from '@/core/utils';
import { validateSchema } from '@/lib/utils/validations';
import {
  rechargeSchema,
  transferSchema,
  TransactionStatus,
  TransactionType,
  WithdrawalSchema,
  BillPaymentSchema,
} from '@/shared/types';

export async function getWalletBalance() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const dbUser = await User.findById(user._id.toString()).select('walletBalance');
    return { balance: dbUser?.walletBalance || 0 };
  } catch (error) {
    console.error('Error fetching balance:', error);
    return { error: getErrorMessage(error) || 'Failed to fetch balance' };
  }
}

export async function getRecentTransactions(limit = 5) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const transactions = await WalletTransaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      transactions: JSON.parse(JSON.stringify(transactions)),
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { error: getErrorMessage(error) || 'Failed to fetch transactions' };
  }
}

async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType
) {
  try {
    await Notification.create({
      userId,
      title,
      message,
      type,
      isRead: false,
    });
  } catch (err) {
    console.error('Failed to create notification', err);
  }
}

export async function rechargeWallet(amount: number, paymentMethod: string = 'upi') {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const validation = validateSchema(rechargeSchema, { amount, paymentMethod });
    if (!validation.success) {
      return { error: validation.errors?.[0]?.message || 'Invalid input' };
    }

    await WalletTransaction.create({
      userId: user._id.toString(),
      type: TransactionType.Credit,
      amount,
      description: `Wallet Recharge via ${paymentMethod}`,
      paymentMethod,
      metadata: {
        initiatedBy: 'user',
      },
    });

    await createNotification(
      user._id.toString(),
      'Wallet Recharged',
      `Your wallet has been credited with ₹${amount}.`,
      NotificationType.INFO
    );

    revalidatePath('/wallet');
    return { success: true, message: 'Recharge successful' };
  } catch (error) {
    console.error('Error recharging wallet:', error);
    return { error: getErrorMessage(error) || 'Recharge failed' };
  }
}

export async function transferMoney(recipientEmail: string, amount: number) {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: 'Unauthorized' };

    const validation = validateSchema(transferSchema, { recipientEmail, amount });
    if (!validation.success) {
      return { error: validation.errors?.[0]?.message || 'Invalid input' };
    }

    if (recipientEmail === currentUser.email) return { error: 'Cannot transfer to self' };

    const sender = await User.findById(currentUser._id);
    if (!sender || (sender.walletBalance || 0) < amount) {
      return { error: 'Insufficient wallet balance' };
    }

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return { error: 'Recipient not found' };
    }

    // Debit Sender
    await WalletTransaction.create({
      userId: sender._id.toString(),
      type: TransactionType.Debit,
      amount,
      description: `Transfer to ${recipient.name} (${recipient.email})`,
      paymentMethod: 'wallet_transfer',
      metadata: {
        recipientId: recipient._id,
        recipientEmail: recipient.email,
      },
    });

    // Credit Recipient
    await WalletTransaction.create({
      userId: recipient._id.toString(),
      type: TransactionType.Credit,
      amount,
      description: `Received from ${sender.name}`,
      paymentMethod: 'wallet_transfer',
      metadata: {
        senderId: sender._id,
        senderEmail: sender.email,
      },
    });

    // Notifications
    await createNotification(
      sender._id.toString(),
      'Money Sent',
      `You sent ₹${amount} to ${recipient.name}.`,
      NotificationType.ACTIVITY
    );

    await createNotification(
      recipient._id.toString(),
      'Money Received',
      `You received ₹${amount} from ${sender.name}.`,
      NotificationType.ACTIVITY
    );

    revalidatePath('/wallet');
    return { success: true, message: 'Transfer successful' };
  } catch (error) {
    console.error('Transfer error:', error);
    return { error: getErrorMessage(error) || 'Transfer failed' };
  }
}

export async function withdrawMoney(amount: number, bankDetails: unknown) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const validation = validateSchema(WithdrawalSchema, { amount, bankDetails });
    if (!validation.success) {
      return { error: validation.errors?.[0]?.message || 'Invalid input' };
    }

    const dbUser = await User.findById(user._id);
    if (!dbUser || (dbUser.walletBalance || 0) < amount) {
      return { error: 'Insufficient balance' };
    }

    await WalletTransaction.create({
      userId: user._id.toString(),
      type: TransactionType.Debit,
      amount,
      description: `Withdrawal request to Bank`,
      paymentMethod: 'bank_transfer',
      status: TransactionStatus.Pending,
      metadata: {
        bankDetails: bankDetails as Record<string, unknown>,
        type: TransactionType.Withdrawal,
      },
    });

    await createNotification(
      user._id.toString(),
      'Withdrawal Requested',
      `Withdrawal request for ₹${amount} submitted successfully.`,
      NotificationType.INFO
    );

    revalidatePath('/wallet');
    return { success: true, message: 'Withdrawal request submitted' };
  } catch (error) {
    console.error('Withdrawal error:', error);
    return { error: getErrorMessage(error) || 'Withdrawal failed' };
  }
}

export async function payBill(amount: number, billDetails: unknown) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const validation = validateSchema(BillPaymentSchema, { amount, billDetails });
    if (!validation.success) {
      return { error: validation.errors?.[0]?.message || 'Invalid input' };
    }

    const dbUser = await User.findById(user._id);
    if (!dbUser || (dbUser.walletBalance || 0) < amount) {
      return { error: 'Insufficient balance' };
    }

    await WalletTransaction.create({
      userId: user._id.toString(),
      type: TransactionType.Debit,
      amount,
      description: `Bill Payment: ${(billDetails as Record<string, unknown>).category || 'Utility'}`,
      paymentMethod: 'wallet_billpay',
      metadata: {
        billDetails: billDetails as Record<string, unknown>,
        type: TransactionType.BillPayment,
      },
    });

    await createNotification(
      user._id.toString(),
      'Bill Paid',
      `Bill payment of ₹${amount} for ${(billDetails as Record<string, unknown>).category as string} successful.`,
      NotificationType.ACTIVITY
    );

    revalidatePath('/wallet');
    return { success: true, message: 'Bill payment successful' };
  } catch (error) {
    console.error('Bill payment error:', error);
    return { error: getErrorMessage(error) || 'Payment failed' };
  }
}
