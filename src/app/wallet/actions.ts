'use server'

import dbConnect from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/session'
import { User, Notification, WalletTransaction } from '@/models'

export async function getWalletBalance() {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        const dbUser = await User.findById(user._id).select('walletBalance');
        return { balance: dbUser?.walletBalance || 0 };
    } catch (error) {
        console.error('Error fetching balance:', error);
        return { error: 'Failed to fetch balance' };
    }
}

export async function getRecentTransactions(limit = 5) {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        const transactions = await WalletTransaction.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return {
            transactions: JSON.parse(JSON.stringify(transactions))
        };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { error: 'Failed to fetch transactions' };
    }
}

async function createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    try {
        await Notification.create({
            userId,
            title,
            message,
            type,
            read: false,
            createdAt: new Date()
        });
    } catch (err) {
        console.error('Failed to create notification', err);
    }
}

export async function rechargeWallet(amount: number, paymentMethod: string = 'upi') {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        if (amount <= 0) return { error: 'Invalid amount' };

        await WalletTransaction.createTransaction({
            userId: user._id.toString(),
            type: 'credit',
            amount,
            description: `Wallet Recharge via ${paymentMethod}`,
            paymentMethod,
            metadata: {
                initiatedBy: 'user'
            }
        });

        await createNotification(
            user._id.toString(),
            'Wallet Recharged',
            `Your wallet has been credited with ₹${amount}.`,
            'success'
        );

        revalidatePath('/wallet');
        return { success: true, message: 'Recharge successful' };

    } catch (error) {
        console.error('Error recharging wallet:', error);
        return { error: 'Recharge failed' };
    }
}

export async function transferMoney(recipientEmail: string, amount: number) {
    try {
        await dbConnect();
        const currentUser = await getCurrentUser();
        if (!currentUser) return { error: 'Unauthorized' };

        if (!amount || amount <= 0) return { error: 'Invalid amount' };
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
        await WalletTransaction.createTransaction({
            userId: sender._id.toString(),
            type: 'debit',
            amount,
            description: `Transfer to ${recipient.name} (${recipient.email})`,
            paymentMethod: 'wallet_transfer',
            metadata: {
                recipientId: recipient._id,
                recipientEmail: recipient.email
            }
        });

        // Credit Recipient
        await WalletTransaction.createTransaction({
            userId: recipient._id.toString(),
            type: 'credit',
            amount,
            description: `Received from ${sender.name}`,
            paymentMethod: 'wallet_transfer',
            metadata: {
                senderId: sender._id,
                senderEmail: sender.email
            }
        });

        // Notifications
        await createNotification(
            sender._id.toString(),
            'Money Sent',
            `You sent ₹${amount} to ${recipient.name}.`,
            'info'
        );

        await createNotification(
            recipient._id.toString(),
            'Money Received',
            `You received ₹${amount} from ${sender.name}.`,
            'success'
        );

        revalidatePath('/wallet');
        return { success: true, message: 'Transfer successful' };

    } catch (error) {
        console.error('Transfer error:', error);
        return { error: 'Transfer failed' };
    }
}

export async function withdrawMoney(amount: number, bankDetails: any) {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        if (amount <= 0) return { error: 'Invalid amount' };

        const dbUser = await User.findById(user._id);
        if (!dbUser || (dbUser.walletBalance || 0) < amount) {
            return { error: 'Insufficient balance' };
        }

        await WalletTransaction.createTransaction({
            userId: user._id.toString(),
            type: 'debit',
            amount,
            description: `Withdrawal request to Bank`,
            paymentMethod: 'bank_transfer',
            status: 'pending',
            metadata: {
                bankDetails,
                type: 'withdrawal'
            }
        });

        await createNotification(
            user._id.toString(),
            'Withdrawal Requested',
            `Withdrawal request for ₹${amount} submitted successfully.`,
            'info'
        );

        revalidatePath('/wallet');
        return { success: true, message: 'Withdrawal request submitted' };

    } catch (error: any) {
        console.error('Withdrawal error:', error);
        return { error: error.message || 'Withdrawal failed' };
    }
}

export async function payBill(amount: number, billDetails: any) {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        if (amount <= 0) return { error: 'Invalid amount' };

        const dbUser = await User.findById(user._id);
        if (!dbUser || (dbUser.walletBalance || 0) < amount) {
            return { error: 'Insufficient balance' };
        }

        await WalletTransaction.createTransaction({
            userId: user._id.toString(),
            type: 'debit',
            amount,
            description: `Bill Payment: ${billDetails.category || 'Utility'}`,
            paymentMethod: 'wallet_billpay',
            status: 'completed',
            metadata: {
                billDetails,
                type: 'bill_payment'
            }
        });

        await createNotification(
            user._id.toString(),
            'Bill Paid',
            `Bill payment of ₹${amount} for ${billDetails.category} successful.`,
            'success'
        );

        revalidatePath('/wallet');
        return { success: true, message: 'Bill payment successful' };

    } catch (error: any) {
        console.error('Bill payment error:', error);
        return { error: error.message || 'Payment failed' };
    }
}
