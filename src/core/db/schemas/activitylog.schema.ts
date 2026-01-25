/**
 * Activity Log Schema
 * Mongoose schema definition for activity logging
 * Uses numeric enums for efficient storage
 */

import { Schema } from 'mongoose';
import { IActivityLog } from '@/core/db/interfaces';
import { ResourceTypeLabel, getEnumRange } from '@/core/db/enums';

export const ActivityLogSchema = new Schema<IActivityLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Already numeric from core enums
    action: {
      type: Number,
      required: true,
      index: true,
    },
    // Stored as number
    resource: {
      type: Number,
      required: true,
      min: getEnumRange(ResourceTypeLabel).min,
      max: getEnumRange(ResourceTypeLabel).max,
      index: true,
    },
    resourceId: {
      type: String,
    },
    details: String,
    metadata: Schema.Types.Mixed,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'activity_logs',
  }
);

// Indexes
ActivityLogSchema.index({ actorId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ resource: 1, resourceId: 1 });
