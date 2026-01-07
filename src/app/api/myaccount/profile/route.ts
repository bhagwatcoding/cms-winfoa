import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/edu/User';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Prevent Updating sensitive fields like password, role directly here if needed
        const { password, role, ...updateData } = body;

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        return NextResponse.json({ user: updatedUser });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
