import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { User, WalletTransaction } from '@/models';

export async function GET() {
    try {
        const { user } = await getSession();

        if (!user || (user.role !== 'super-admin' && !user.isGod)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const [
            totalRevenue,
            totalUsers,
            activeUsers,
            recentTransactions,
        ] = await Promise.all([
            WalletTransaction.aggregate([
                { $match: { type: 'credit', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            User.countDocuments({ isDeleted: false }),
            User.countDocuments({ status: 'active', isDeleted: false }),
            WalletTransaction.find().sort({ createdAt: -1 }).limit(10).lean(),
        ]);

        return NextResponse.json({
            revenue: totalRevenue[0]?.total || 0,
            totalUsers,
            activeUsers,
            recentTransactions,
        });
    } catch (error: unknown) {
        console.error('Failed to fetch analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
