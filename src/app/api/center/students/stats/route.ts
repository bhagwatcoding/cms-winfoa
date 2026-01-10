import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Student } from '@/models';

// GET /api/students/stats - Get student statistics
export async function GET() {
    try {
        await connectDB();

        const total = await Student.countDocuments();
        const active = await Student.countDocuments({ status: 'active' });
        const completed = await Student.countDocuments({ status: 'completed' });
        const dropped = await Student.countDocuments({ status: 'dropped' });

        return NextResponse.json({
            success: true,
            data: {
                total,
                active,
                completed,
                dropped,
            }
        });
    } catch (error: unknown) {
        console.error('Error fetching student stats:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch student stats';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
