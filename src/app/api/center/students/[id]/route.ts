import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/models';

// GET /api/students/[id] - Get student by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const student = await Student.findById((await params).id).populate('courseId', 'name code duration fee');

        if (!student) {
            return NextResponse.json(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: student });
    } catch (error: unknown) {
        console.error('Error fetching student:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// PUT /api/students/[id] - Update student
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();

        const student = await Student.findByIdAndUpdate(
            (await params).id,
            body,
            { new: true, runValidators: true }
        ).populate('courseId', 'name code');

        if (!student) {
            return NextResponse.json(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: student,
            message: 'Student updated successfully'
        });
    } catch (error: unknown) {
        console.error('Error updating student:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update student';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const student = await Student.findByIdAndDelete((await params).id);

        if (!student) {
            return NextResponse.json(
                { success: false, error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error: unknown) {
        console.error('Error deleting student:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete student';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
