import { ActivityLog, ResourceType } from '@/models';
import { ActionType } from '@/types';

export class ActivityLogger {
  static async log(
    userId: string,
    action: ActionType,
    resourceType: ResourceType,
    details: string,
    resourceId?: string,
    metadata?: Record<string, unknown>
  ) {
    try {
      await ActivityLog.create({
        actorId: userId,
        action,
        resource: resourceType,
        details,
        resourceId,
        metadata,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }
  static async getUserLogs(userId: string) {
    try {
      return await ActivityLog.find({ actorId: userId }).sort({ createdAt: -1 }).limit(20).lean();
    } catch (error) {
      console.error('Failed to fetch user logs:', error);
      return [];
    }
  }
}
