import { AuditLog } from '@/core/db/models';
import { IAuditLog } from '@/core/db/models/core/AuditLog';

/**
 * Service for System Auditing and User Activity Logging
 */
export class AuditService {
  /**
   * Log a system audit event
   */
  static async logAudit(entry: {
    action?: string;
    eventType?: string;
    category: number; // AuditCategory
    severity: number; // AuditSeverity
    userId?: string;
    resource?: string;
    details?: unknown;
    ip?: string;
    message?: string;
  }): Promise<void> {
    try {
      await AuditLog.log({
        eventType: entry.eventType || entry.action || 'unknown',
        category: entry.category,
        severity: entry.severity,
        actor: { userId: entry.userId, ip: entry.ip },
        message: entry.message || `Action: ${entry.action}`,
        details: entry.details,
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  /**
   * List audit logs
   */
  static async listAuditLogs(
    filter: Record<string, unknown> = {},
    limit = 50,
    skip = 0
  ): Promise<IAuditLog[]> {
    return AuditLog.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).exec();
  }
}
