'use server';

import connectDB from '@/lib/db';
import { Notification } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all notifications
export async function getNotifications(userId?: string) {
    try {
        await connectDB();
        const query = userId ? { userId } : {};

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

// Get unread notifications count
export async function getUnreadCount(userId: string) {
    try {
        await connectDB();
        const count = await Notification.countDocuments({
            userId,
            isRead: false
        });

        return count;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
}

// Create notification
export async function createNotification(data: any) {
    try {
        await connectDB();
        const notification = await Notification.create(data);

        revalidatePath('/skills/notifications');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(notification))
        };
    } catch (error: any) {
        console.error('Error creating notification:', error);
        return {
            success: false,
            error: error.message || 'Failed to create notification'
        };
    }
}

// Mark notification as read
export async function markAsRead(id: string) {
    try {
        await connectDB();
        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            return { success: false, error: 'Notification not found' };
        }

        revalidatePath('/skills/notifications');
        return { success: true };
    } catch (error: any) {
        console.error('Error marking notification as read:', error);
        return {
            success: false,
            error: error.message || 'Failed to mark as read'
        };
    }
}

// Mark all notifications as read
export async function markAllAsRead(userId: string) {
    try {
        await connectDB();
        await Notification.updateMany(
            { userId, isRead: false },
            { $set: { isRead: true } }
        );

        revalidatePath('/skills/notifications');
        return { success: true };
    } catch (error: any) {
        console.error('Error marking all as read:', error);
        return {
            success: false,
            error: error.message || 'Failed to mark all as read'
        };
    }
}

// Delete notification
export async function deleteNotification(id: string) {
    try {
        await connectDB();
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return { success: false, error: 'Notification not found' };
        }

        revalidatePath('/skills/notifications');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting notification:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete notification'
        };
    }
}
