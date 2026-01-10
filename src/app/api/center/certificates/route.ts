import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Certificate } from '@/models';
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
        const studentId = searchParams.get('studentId');

        const skip = (page - 1) * limit;
        const query: Record<string, unknown> = { centerId: user.centerId };

        if (studentId) query.studentId = studentId;

        const [certificates, total] = await Promise.all([
            Certificate.find(query)
                .populate('studentId', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Certificate.countDocuments(query),
        ]);

        return NextResponse.json({
            certificates,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: unknown) {
        console.error('Failed to fetch certificates:', error);
        return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
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

        // Logic to generate unique certificate number 
        const certificateNumber = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const certificate = await Certificate.create({
            ...body,
            centerId: user.centerId,
            certificateNumber,
            issuedDate: new Date(),
        });

        return NextResponse.json(certificate, { status: 201 });
    } catch (error: unknown) {
        console.error('Failed to create certificate:', error);
        return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
    }
}
