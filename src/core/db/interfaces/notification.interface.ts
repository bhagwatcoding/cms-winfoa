/**
 * Notification Interfaces
 * Type definitions for notifications
 */

import { Document, Types } from 'mongoose';
import { NotificationType, NotificationPriority, NotificationChannel } from '@/core/db/enums';

// Re-export enums for convenience
export { NotificationType, NotificationPriority, NotificationChannel };

// ==========================================
// INTERFACE
// ==========================================

export interface INotification extends Document {
  // Target
  userId: Types.ObjectId;

  // Content - type stored as number
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  icon?: string;

  // Status
  isRead: boolean;
  readAt?: Date;
  isDismissed: boolean;
  dismissedAt?: Date;

  // Priority & Expiry - stored as number
  priority: NotificationPriority;
  expiresAt?: Date;

  // Channels - stored as array of numbers
  channels: NotificationChannel[];
  sentVia?: NotificationChannel[];

  // Metadata
  metadata?: Record<string, unknown>;
  category?: string;

  // Action tracking
  actionTaken?: boolean;
  actionType?: string;
  actionAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  markAsRead(): Promise<INotification>;
  dismiss(): Promise<INotification>;
}
