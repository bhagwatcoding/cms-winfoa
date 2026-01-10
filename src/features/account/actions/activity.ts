'use server'

import { ActivityService } from '../services'
import { SessionService } from '@/auth/services'
import { getErrorMessage } from '@/lib/utils'

export async function getActivityLogs(options: {
    page?: number
    limit?: number
    action?: string
} = {}) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const result = await ActivityService.getActivityLogs(
            session.userId._id.toString(),
            options
        )

        return { success: true, data: result }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function getRecentActivity(limit: number = 10) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const logs = await ActivityService.getRecentActivity(
            session.userId._id.toString(),
            limit
        )

        return { success: true, data: logs }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function getActivityStats() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const stats = await ActivityService.getActivityStats(
            session.userId._id.toString()
        )

        return { success: true, data: stats }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function clearOldLogs(daysOld: number = 90) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const result = await ActivityService.clearOldLogs(
            session.userId._id.toString(),
            daysOld
        )

        return { success: true, data: result }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}
