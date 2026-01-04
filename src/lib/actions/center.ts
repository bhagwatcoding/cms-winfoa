"use server";

import connectDB from '@/lib/db';
import Center from '@/lib/models/Center';

export async function getCenterInfo(code: string) {
    try {
        await connectDB();
        const center = await Center.findOne({ code }).lean();
        return JSON.parse(JSON.stringify(center));
    } catch (error) {
        console.error('Failed to fetch center info:', error);
        return null;
    }
}

export async function updateWallet(code: string, amount: number) {
    try {
        await connectDB();
        const center = await Center.findOneAndUpdate(
            { code },
            { $inc: { walletBalance: amount } },
            { new: true }
        );
        return JSON.parse(JSON.stringify(center));
    } catch (error) {
        console.error('Failed to update wallet:', error);
        return null;
    }
}
