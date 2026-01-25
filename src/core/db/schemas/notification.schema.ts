/**
 * Notification Schema
 * Mongoose schema definition for notifications
 * Uses numeric enums for efficient storage
 */

import { Schema } from 'mongoose';
import { INotification } from '@/core/db/interfaces';
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
  NotificationTypeLabel,
  NotificationPriorityLabel,
  getEnumRange,
} from '@/core/db/enums';

export const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },

    // Stored as number
    type: {
      type: Number,
      default: NotificationType.INFO,
      min: getEnumRange(NotificationTypeLabel).min,
      max: getEnumRange(NotificationTypeLabel).max,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 1000,
    },
    link: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,
    isDismissed: {
      type: Boolean,
      default: false,
    },
    dismissedAt: Date,

    // Stored as number
    priority: {
      type: Number,
      default: NotificationPriority.NORMAL,
      min: getEnumRange(NotificationPriorityLabel).min,
      max: getEnumRange(NotificationPriorityLabel).max,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },

    // Stored as array of numbers
    channels: {
      type: [Number],
      default: [NotificationChannel.IN_APP],
    },
    sentVia: {
      type: [Number],
      default: [],
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    category: String,

    actionTaken: {
      type: Boolean,
      default: false,
    },
    actionType: String,
    actionAt: Date,
  },
  {
    timestamps: true,
    collection: 'notifications',
  }
);

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Instance Methods
NotificationSchema.methods.markAsRead = async function (): Promise<INotification> {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.dismiss = async function (): Promise<INotification> {
  this.isDismissed = true;
  this.dismissedAt = new Date();
  return this.save();
};
