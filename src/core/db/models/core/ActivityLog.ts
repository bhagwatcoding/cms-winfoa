/**
 * Activity Log Model
 * Combines schema with model export
 */

import { Model, model, models } from 'mongoose';
import { ActivityLogSchema } from '@/core/db/schemas/activitylog.schema';
import { IActivityLog, ResourceType } from '@/core/db/interfaces/activitylog.interface';

// ==========================================
// EXPORT
// ==========================================

export type { IActivityLog };
export { ResourceType };

export default (models.ActivityLog as Model<IActivityLog>) ||
  model<IActivityLog>('ActivityLog', ActivityLogSchema);
