import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Transaction } from '@/models';
import { Student } from '@/models';
import { Certificate } from '@/models';

export async function GET(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user || user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const [
            totalRevenue,
            totalStudents,
            totalCertificates,
            recentTransactions,
        ] = await Promise.all([
            Transaction.aggregate([
                { $match: { type: 'credit', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            Student.countDocuments(),
            Certificate.countDocuments({ status: 'issued' }),
            Transaction.find().sort({ createdAt: -1 }).limit(10).lean(),
        ]);

        return NextResponse.json({
            revenue: totalRevenue[0]?.total || 0,
            students: totalStudents,
            certificates: totalCertificates,
            recentTransactions,
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
