import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Course } from '@/models';

// GET /api/courses/[id] - Get course by ID
export async function GET(
    request: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }
) {
    try {
        await connectDB();

        const course = await Course.findById((await params).id);

        if (!course) {
            return NextResponse.json(
                { success: false, error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: course });
    } catch (error: any) {
        console.error('Error fetching course:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/courses/[id] - Update course
export async function PUT(
    request: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }
) {
    try {
        await connectDB();

        const body = await request.json();

        const course = await Course.findByIdAndUpdate(
            (await params).id,
            body,
            { new: true, runValidators: true }
        );

        if (!course) {
            return NextResponse.json(
                { success: false, error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: course,
            message: 'Course updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating course:', error);

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

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
    request: NextRequest,
    { params }: {
        params: Promise<{ id: string }>
    }
) {
    try {
        await connectDB();

        const course = await Course.findByIdAndDelete((await params).id);

        if (!course) {
            return NextResponse.json(
                { success: false, error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting course:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
