import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/lib/models/edu/Employee';
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
        const query: any = { centerId: user.centerId };

        const [employees, total] = await Promise.all([
            Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Employee.countDocuments(query),
        ]);

        return NextResponse.json({
            employees,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const employee = await Employee.create({ ...body, centerId: user.centerId });

        return NextResponse.json(employee, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
    }
}
