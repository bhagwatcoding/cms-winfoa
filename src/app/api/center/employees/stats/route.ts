import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Employee from '@/lib/models/edu/Employee';

// GET /api/employees/stats - Get employee statistics
export async function GET() {
    try {
        await connectDB();

        const total = await Employee.countDocuments();
        const active = await Employee.countDocuments({ status: 'active' });
        const onLeave = await Employee.countDocuments({ status: 'on-leave' });
        const inactive = await Employee.countDocuments({ status: 'inactive' });

        return NextResponse.json({
            success: true,
            data: {
                total,
                active,
                onLeave,
                inactive,
            }
        });
    } catch (error: any) {
        console.error('Error fetching employee stats:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
