import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Employee } from '@/models';

// GET /api/employees/[id] - Get employee by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const employee = await Employee.findById((await params).id);

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: employee });
    } catch (error: unknown) {
        console.error('Error fetching employee:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employee';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// PUT /api/employees/[id] - Update employee
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const body = await request.json();

        const employee = await Employee.findByIdAndUpdate(
            (await params).id,
            body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: employee,
            message: 'Employee updated successfully'
        });
    } catch (error: unknown) {
        console.error('Error updating employee:', error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Email already exists' },
                { status: 400 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const employee = await Employee.findByIdAndDelete((await params).id);

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error: unknown) {
        console.error('Error deleting employee:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete employee';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
