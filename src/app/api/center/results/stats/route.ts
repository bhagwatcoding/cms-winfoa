import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Result } from '@/models';

// GET /api/results/stats - Get result statistics
export async function GET() {
    try {
        await connectDB();

        const totalExams = await Result.countDocuments();
        const passed = await Result.countDocuments({ status: 'pass' });
        const failed = await Result.countDocuments({ status: 'fail' });

        // Calculate pass rate
        const passRate = totalExams > 0 ? ((passed / totalExams) * 100).toFixed(2) : '0';

        // Calculate average score
        const results = await Result.find().lean();
        const averageScore = results.length > 0
            ? (results.reduce((sum, result) => sum + ((result.marks / result.totalMarks) * 100), 0) / results.length).toFixed(2)
            : '0';

        return NextResponse.json({
            success: true,
            data: {
                totalExams,
                passed,
                failed,
                passRate: parseFloat(passRate),
                averageScore: parseFloat(averageScore),
                pending: 0, // This can be calculated based on scheduled exams if you have that data
            }
        });
    } catch (error: any) {
        console.error('Error fetching result stats:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
