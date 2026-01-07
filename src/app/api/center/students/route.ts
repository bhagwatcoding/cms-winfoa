import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/models';
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
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;
        const query: any = { centerId: user.centerId };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { enrollmentId: { $regex: search, $options: 'i' } },
            ];
        }

        const [students, total] = await Promise.all([
            Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Student.countDocuments(query),
        ]);

        return NextResponse.json({
            students,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
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
        const student = await Student.create({ ...body, centerId: user.centerId });

        return NextResponse.json(student, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
