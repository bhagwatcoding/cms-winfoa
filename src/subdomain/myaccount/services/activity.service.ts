import ActivityLog from '../models/ActivityLog'
import connectDB from '@/lib/db'

export class ActivityService {
    /**
     * Get user activity logs
     */
    static async getActivityLogs(
        userId: string,
        options: {
            page?: number
            limit?: number
            action?: string
        } = {}
    ) {
        await connectDB()

        const { page = 1, limit = 20, action } = options
        const skip = (page - 1) * limit

        // Build filter
        const filter: any = { userId }
        if (action) {
            filter.action = action
        }

        // Get logs with pagination
        const logs = await ActivityLog
            .find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Get total count
        const total = await ActivityLog.countDocuments(filter)

        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    }

    /**
     * Get recent activity
     */
    static async getRecentActivity(userId: string, limit: number = 10) {
        await connectDB()

        const logs = await ActivityLog
            .find({ userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean()

        return logs
    }

    /**
     * Get activity by action type
     */
    static async getActivityByType(userId: string, action: string) {
        await connectDB()

        const logs = await ActivityLog
            .find({ userId, action })
            .sort({ timestamp: -1 })
            .lean()

        return logs
    }

    /**
     * Get activity statistics
     */
    static async getActivityStats(userId: string) {
        await connectDB()

        const stats = await ActivityLog.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                    lastActivity: { $max: '$timestamp' }
                }
            },
            { $sort: { count: -1 } }
        ])

        const totalActivities = await ActivityLog.countDocuments({ userId })

        return {
            totalActivities,
            byType: stats
        }
    }

    /**
     * Clear old activity logs
     */
    static async clearOldLogs(userId: string, daysOld: number = 90) {
        await connectDB()

        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysOld)

        const result = await ActivityLog.deleteMany({
            userId,
            timestamp: { $lt: cutoffDate }
        })

        return {
            success: true,
            deletedCount: result.deletedCount
        }
    }

    /**
     * Log activity (helper method)
     */
    static async logActivity(
        userId: string,
        action: string,
        details?: any,
        metadata?: {
            ipAddress?: string
            userAgent?: string
            location?: string
        }
    ) {
        await connectDB()

        await ActivityLog.create({
            userId,
            action,
            details,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
            location: metadata?.location,
            timestamp: new Date()
        })
    }
}
