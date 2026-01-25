/**
 * Activity Log Interfaces
 * Type definitions for activity logging
 */

import { Document, Types } from 'mongoose';
import { ActionType } from '@/core/db/enums';
import { ResourceType } from '@/core/db/enums';

// Re-export enum for convenience
export { ResourceType };

// ==========================================
// INTERFACE
// ==========================================

export interface IActivityLog extends Document {
  actorId: Types.ObjectId;
  action: ActionType; // Already numeric
  resource: ResourceType; // Now numeric
  resourceId?: string;
  details?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
