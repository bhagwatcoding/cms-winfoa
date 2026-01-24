import "server-only";
import { headers } from "next/headers";
import { ActivityLog } from "@/models";
import { ActionType, ResourceType } from "@/types";
import { connectDB } from "@/lib/db"; // Your DB connection utility

export class ActivityLogger {
  /**
   * Main function to record an activity.
   * Auto-detects IP and User Agent from Next.js headers.
   */
  static async log(
    actorId: string,
    action: ActionType,
    resource: ResourceType,
    details: string,
    resourceId?: string,
    metadata?: Record<string, any>,
  ) {
    try {
      await connectDB();

      const headerStore = await headers();
      const ip = headerStore.get("x-forwarded-for") || "127.0.0.1";
      const ua = headerStore.get("user-agent") || "Unknown";

      await ActivityLog.create({
        actorId,
        action,
        resource,
        resourceId,
        details,
        metadata: {
          ...(metadata || {}),
          ipAddress: ip,
          userAgent: ua,
        },
      });
    } catch (error) {
      // Fail silently or log to system console so user flow isn't broken
      console.error("FAILED TO LOG ACTIVITY:", error);
    }
  }

  /**
   * Fetch logs for a specific user (e.g., for "My Activity History" page)
   */
  static async getUserLogs(userId: string, limit = 20) {
    await connectDB();
    return ActivityLog.find({ actorId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Fetch logs for Admins (Filtered by action type)
   */
  static async getSystemLogs(action?: ActionType) {
    await connectDB();
    const query = action ? { action } : {};
    return ActivityLog.find(query)
      .populate("actorId", "name email role") // Show who did it
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }
}
