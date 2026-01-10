import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Course } from '@/models';
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

        const [courses, total] = await Promise.all([
            Course.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Course.countDocuments(),
        ]);

        return NextResponse.json({
            courses,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: unknown) {
        console.error('Failed to fetch courses:', error);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
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
        const course = await Course.create(body);

        return NextResponse.json(course, { status: 201 });
    } catch (error: unknown) {
        console.error('Failed to create course:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
