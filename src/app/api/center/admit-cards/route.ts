import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { AdmitCard } from '@/models';
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

        const skip = (page - 1) * limit;
        const query: any = { centerId: user.centerId };

        const [admitCards, total] = await Promise.all([
            AdmitCard.find(query)
                .populate('studentId', 'name enrollmentId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AdmitCard.countDocuments(query),
        ]);

        return NextResponse.json({
            admitCards,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch admit cards' }, { status: 500 });
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
        const admitCard = await AdmitCard.create({
            ...body,
            centerId: user.centerId,
        });

        return NextResponse.json(admitCard, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create admit card' }, { status: 500 });
    }
}
