import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search');

        let query: any = {};

        if (isActive !== null) query.isActive = isActive === 'true';
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
            ];
        }

        const courses = await Course.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: courses,
            count: courses.length
        });
    } catch (error: any) {
        console.error('Error fetching courses:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        const { name, code, duration, fee } = body;
        if (!name || !code || !duration || fee === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const course = await Course.create(body);

        return NextResponse.json({
            success: true,
            data: course,
            message: 'Course created successfully'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating course:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Course name or code already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
