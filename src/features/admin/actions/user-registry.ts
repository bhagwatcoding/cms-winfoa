'use server'

import { UserIdService } from '../services/userid.service'
import { SessionService } from '@/auth/services/session.service'

export async function registerUserInUMP(data: {
    email: string
    role: string
    metadata?: any
}) {
    try {
        const session = await SessionService.getCurrentSession()

        const result = await UserIdService.registerUser({
            email: data.email,
            role: data.role,
            createdBy: session?.userId?._id?.toString(),
            metadata: data.metadata
        })

        return { success: true, data: result }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function activateUserInUMP(userId: string) {
    try {
        const result = await UserIdService.activateUser(userId)
        return { success: true, data: result }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getAllUsersFromUMP(options?: {
    page?: number
    limit?: number
    status?: string
    role?: string
}) {
    try {
        const result = await UserIdService.getAllUsers(options)
        return { success: true, ...result }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getUserStats() {
    try {
        const stats = await UserIdService.getStatistics()
        return { success: true, data: stats }
    } catch (error: any) {
        return { error: error.message }
    }
}
