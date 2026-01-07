'use server';

import connectDB from '@/lib/db';
import { Transaction, User } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all transactions for a user
export async function getTransactions(userId: string) {
    try {
        await connectDB();
        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(transactions));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

// Get transaction by ID
export async function getTransactionById(id: string) {
    try {
        await connectDB();
        const transaction = await Transaction.findById(id).lean();

        return JSON.parse(JSON.stringify(transaction));
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return null;
    }
}

// Create transaction
export async function createTransaction(data: any) {
    try {
        await connectDB();

        const transaction = await Transaction.create(data);

        // Update user wallet balance
        if (data.type === 'credit') {
            await User.findByIdAndUpdate(
                data.userId,
                { $inc: { walletBalance: data.amount } }
            );
        } else if (data.type === 'debit') {
            await User.findByIdAndUpdate(
                data.userId,
                { $inc: { walletBalance: -data.amount } }
            );
        }

        revalidatePath('/skills/wallet/transactions');
        revalidatePath('/myaccount');

        return {
            success: true,
            data: JSON.parse(JSON.stringify(transaction))
        };
    } catch (error: any) {
        console.error('Error creating transaction:', error);
        return {
            success: false,
            error: error.message || 'Failed to create transaction'
        };
    }
}

// Get transaction summary
export async function getTransactionSummary(userId: string) {
    try {
        await connectDB();

        const [totalCredit, totalDebit, transactionCount] = await Promise.all([
            Transaction.aggregate([
                { $match: { userId, type: 'credit' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Transaction.aggregate([
                { $match: { userId, type: 'debit' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Transaction.countDocuments({ userId })
        ]);

        return {
            totalCredit: totalCredit[0]?.total || 0,
            totalDebit: totalDebit[0]?.total || 0,
            transactionCount
        };
    } catch (error) {
        console.error('Error fetching transaction summary:', error);
        return {
            totalCredit: 0,
            totalDebit: 0,
            transactionCount: 0
        };
    }
}
