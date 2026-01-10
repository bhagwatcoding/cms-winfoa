import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Notification } from '@/models';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');

        const query: Record<string, unknown> = { userId: user._id };

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ notifications });
    } catch (error: unknown) {
        console.error('Failed to fetch notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { user } = await getSession();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        if (body.action === 'mark_all_read') {
            await Notification.updateMany(
                { userId: user._id, read: false },
                { $set: { read: true } }
            );
            return NextResponse.json({ message: 'Marked all as read' });
        }

        if (body.id) {
            await Notification.updateOne(
                { _id: body.id, userId: user._id },
                { $set: { read: true } }
            );
            return NextResponse.json({ message: 'Marked as read' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: unknown) {
        console.error('Failed to update notifications:', error);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}
