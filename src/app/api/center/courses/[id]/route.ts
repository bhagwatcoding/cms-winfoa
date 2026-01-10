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
    } catch (error: unknown) {
        console.error('Error fetching course:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch course';
        return NextResponse.json(
            { success: false, error: errorMessage },
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
    } catch (error: unknown) {
        console.error('Error updating course:', error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Course name or code already exists' },
                { status: 400 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to update course';
        return NextResponse.json(
            { success: false, error: errorMessage },
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
    } catch (error: unknown) {
        console.error('Error deleting course:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete course';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
