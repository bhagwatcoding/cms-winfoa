import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/lib/models/edu/Result';

// GET /api/results/[id] - Get result by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const result = await Result.findById((await params).id)
            .populate('studentId', 'name email phone')
            .populate('courseId', 'name code duration');

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Result not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error fetching result:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/results/[id] - Update result
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();

        const result = await Result.findByIdAndUpdate(
            (await params).id,
            body,
            { new: true, runValidators: true }
        ).populate('studentId', 'name email')
            .populate('courseId', 'name code');

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Result not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result,
            message: 'Result updated successfully'
        });
    } catch (error: any) {
        console.error('Error updating result:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/results/[id] - Delete result
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const result = await Result.findByIdAndDelete((await params).id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Result not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Result deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting result:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
