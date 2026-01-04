import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Student from '@/models/Student';

// GET /api/students - Get all students with optional filters
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const courseId = searchParams.get('courseId');

        let query: any = {};

        if (status) query.status = status;
        if (courseId) query.courseId = courseId;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const students = await Student.find(query)
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: students,
            count: students.length
        });
    } catch (error: any) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST /api/students - Create a new student
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate required fields
        const { name, fatherName, motherName, dob, gender, courseId } = body;
        if (!name || !fatherName || !motherName || !dob || !gender || !courseId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const student = await Student.create(body);
        const populatedStudent = await Student.findById(student._id).populate('courseId', 'name code');

        return NextResponse.json({
            success: true,
            data: populatedStudent,
            message: 'Student created successfully'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating student:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
