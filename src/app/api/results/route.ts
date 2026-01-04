import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Result from '@/models/Result';

// GET /api/results - Get all results
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');
        const courseId = searchParams.get('courseId');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        let query: any = {};

        if (studentId) query.studentId = studentId;
        if (courseId) query.courseId = courseId;
        if (status) query.status = status;

        let results = await Result.find(query)
            .populate('studentId', 'name email phone')
            .populate('courseId', 'name code')
            .sort({ examDate: -1 })
            .lean();

        // Search filter (after population)
        if (search) {
            results = results.filter((result: any) =>
                result.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                result.courseId?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        return NextResponse.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error: any) {
        console.error('Error fetching results:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/results - Create a new result
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        const { studentId, courseId, examDate, marks, totalMarks, grade, status } = body;
        if (!studentId || !courseId || !examDate || marks === undefined || !totalMarks || !grade || !status) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const result = await Result.create(body);
        const populatedResult = await Result.findById(result._id)
            .populate('studentId', 'name email')
            .populate('courseId', 'name code');

        return NextResponse.json({
            success: true,
            data: populatedResult,
            message: 'Result created successfully'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating result:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
