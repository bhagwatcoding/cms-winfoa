/**
 * Notification Model
 * Combines schema with model export and static methods
 */

import { Model, model, models, Types } from 'mongoose';
import { NotificationSchema } from '@/core/db/schemas/notification.schema';
import {
  INotification,
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from '@/core/db/interfaces/notification.interface';

// ==========================================
// STATIC METHODS INTERFACE
// ==========================================

interface INotificationModel extends Model<INotification> {
  createNotification(params: {
    userId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    priority?: NotificationPriority;
    metadata?: Record<string, unknown>;
  }): Promise<INotification>;
  getUnreadCount(userId: Types.ObjectId): Promise<number>;
  getForUser(userId: Types.ObjectId, limit?: number): Promise<INotification[]>;
  markAllAsRead(userId: Types.ObjectId): Promise<void>;
  deleteOld(days?: number): Promise<number>;
}

// ==========================================
// STATIC METHODS
// ==========================================

NotificationSchema.statics.createNotification = async function (params: {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  priority?: NotificationPriority;
  metadata?: Record<string, unknown>;
}): Promise<INotification> {
  const notification = new this({
    ...params,
    priority: params.priority ?? NotificationPriority.NORMAL,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
  return notification.save();
};

NotificationSchema.statics.getUnreadCount = function (userId: Types.ObjectId): Promise<number> {
  return this.countDocuments({ userId, isRead: false, isDismissed: false });
};

NotificationSchema.statics.getForUser = function (
  userId: Types.ObjectId,
  limit = 50
): Promise<INotification[]> {
  return this.find({ userId, isDismissed: false }).sort({ createdAt: -1 }).limit(limit);
};

NotificationSchema.statics.markAllAsRead = async function (userId: Types.ObjectId): Promise<void> {
  await this.updateMany({ userId, isRead: false }, { isRead: true, readAt: new Date() });
};

NotificationSchema.statics.deleteOld = async function (days = 90): Promise<number> {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const result = await this.deleteMany({ createdAt: { $lt: cutoffDate } });
  return result.deletedCount;
};

// ==========================================
// EXPORT
// ==========================================

export type { INotification };
export { NotificationType, NotificationPriority, NotificationChannel };

export default (models.Notification as INotificationModel) ||
  model<INotification, INotificationModel>('Notification', NotificationSchema);
