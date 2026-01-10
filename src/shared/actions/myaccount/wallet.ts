'use server';

import connectDB from '@/lib/db';
import { User } from '@/models';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';
import { Transaction } from "@/models"

// Get wallet balance
export async function getWalletBalance(userId: string) {
    try {
        await connectDB();
        const user = await User.findById(userId).select('walletBalance');

        return {
            success: true,
            balance: user?.walletBalance || 0
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to fetch balance'
        };
    }
}

// Add funds to wallet
export async function addFunds(userId: string, amount: number, _paymentMethod: string) {
    try {
        await connectDB();

        if (amount <= 0) {
            return {
                success: false,
                error: 'Invalid amount'
            };
        }

        const user = await User.findById(userId);

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Update wallet balance
        user.walletBalance = (user.walletBalance || 0) + amount;
        await user.save();

        // TODO: Create transaction record

        revalidatePath('/myaccount');
        revalidatePath('/skills/wallet');

        return {
            success: true,
            balance: user.walletBalance,
            message: `₹${amount} added successfully`
        };
    } catch (error) {
        console.error('Error adding funds:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to add funds'
        };
    }
}

// Deduct funds from wallet
export async function deductFunds(userId: string, amount: number, _description: string) {
    try {
        await connectDB();

        if (amount <= 0) {
            return {
                success: false,
                error: 'Invalid amount'
            };
        }

        const user = await User.findById(userId);

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        if ((user.walletBalance || 0) < amount) {
            return {
                success: false,
                error: 'Insufficient balance'
            };
        }

        // Update wallet balance
        user.walletBalance = (user.walletBalance || 0) - amount;
        await user.save();

        // TODO: Create transaction record

        revalidatePath('/myaccount');
        revalidatePath('/skills/wallet');

        return {
            success: true,
            balance: user.walletBalance,
            message: `₹${amount} deducted successfully`
        };
    } catch (error) {
        console.error('Error deducting funds:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to deduct funds'
        };
    }
}

// Get wallet transaction history
export async function getWalletTransactions(_userId: string) {
    try {
        await connectDB();

        // TODO: Implement actual transaction model and fetch
        const transactions = await Transaction.find({ userId: _userId });
        if (!transactions) {
            return {
                success: false,
                error: 'No transactions found'
            };
        }

        return {
            success: true,
            transactions
        };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to fetch transactions'
        };
    }
}
