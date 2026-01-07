'use server';

import connectDB from '@/lib/db';
import { User } from '@/models';
import { revalidatePath } from 'next/cache';

// Get wallet balance
export async function getWalletBalance(userId: string) {
    try {
        await connectDB();
        const user = await User.findById(userId).select('walletBalance');

        return {
            success: true,
            balance: user?.walletBalance || 0
        };
    } catch (error: any) {
        console.error('Error fetching wallet balance:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch balance'
        };
    }
}

// Add funds to wallet
export async function addFunds(userId: string, amount: number, paymentMethod: string) {
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
    } catch (error: any) {
        console.error('Error adding funds:', error);
        return {
            success: false,
            error: error.message || 'Failed to add funds'
        };
    }
}

// Deduct funds from wallet
export async function deductFunds(userId: string, amount: number, description: string) {
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
    } catch (error: any) {
        console.error('Error deducting funds:', error);
        return {
            success: false,
            error: error.message || 'Failed to deduct funds'
        };
    }
}

// Get wallet transaction history
export async function getWalletTransactions(userId: string) {
    try {
        await connectDB();

        // TODO: Implement actual transaction model and fetch
        // For now returning empty array
        return [];
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}
