import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Center from '@/lib/models/edu/Center';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user || user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const skip = (page - 1) * limit;

        const [centers, total] = await Promise.all([
            Center.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Center.countDocuments(),
        ]);

        return NextResponse.json({
            centers,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch centers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user || user.role !== 'super-admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const center = await Center.create(body);

        return NextResponse.json(center, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create center' }, { status: 500 });
    }
}
