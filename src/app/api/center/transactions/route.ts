import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/lib/models/edu/Transaction';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const type = searchParams.get('type');

        const skip = (page - 1) * limit;
        const query: any = { userId: user._id };

        if (type) query.type = type;

        const [transactions, total] = await Promise.all([
            Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Transaction.countDocuments(query),
        ]);

        return NextResponse.json({
            transactions,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();

        // In a real app, this would be handled by a detailed payment confirmation flow
        // or by an admin webhook for credit additions.
        const transaction = await Transaction.create({
            ...body,
            userId: user._id,
            centerId: user.centerId,
        });

        return NextResponse.json(transaction, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}
