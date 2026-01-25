import { Notification } from '@/core/db/models';
import { INotification } from '@/core/db/interfaces';
import { NotificationType, NotificationPriority, NotificationChannel } from '@/core/db/enums';
import { Types } from 'mongoose';

/**
 * Service for Notification Management
 */
export class NotificationService {
  /**
   * Create a notification
   */
  static async create(data: {
    userId: string | Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
    metadata?: Record<string, unknown>;
  }): Promise<INotification> {
    return Notification.create({
      ...data,
      createdAt: new Date(),
    });
  }

  /**
   * Mark as read
   */
  static async markAsRead(id: string | Types.ObjectId): Promise<boolean> {
    const result = await Notification.findByIdAndUpdate(id, {
      read: true,
      readAt: new Date(),
    });
    return !!result;
  }

  /**
   * Mark all as read for user
   */
  static async markAllAsRead(userId: string | Types.ObjectId): Promise<number> {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );
    return result.modifiedCount;
  }

  /**
   * List user notifications
   */
  static async list(
    userId: string | Types.ObjectId,
    unreadOnly = false,
    limit = 20,
    skip = 0
  ): Promise<INotification[]> {
    const query: Record<string, unknown> = { userId };
    if (unreadOnly) {
      query['read'] = false;
    }
    return Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
  }
}
