'use server'

import { revalidatePath } from 'next/cache'
import { ApiKeyService } from '../services'
import { SessionService } from '@/auth/services/session.service'

export async function createApiKey(prevState: any, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const name = formData.get('name') as string
        const permissions = formData.get('permissions')
            ? JSON.parse(formData.get('permissions') as string)
            : ['read']
        const rateLimit = formData.get('rateLimit')
            ? parseInt(formData.get('rateLimit') as string)
            : 1000

        if (!name) {
            return { error: 'API key name is required' }
        }

        const apiKey = await ApiKeyService.createApiKey(
            session.userId._id.toString(),
            {
                name,
                permissions,
                rateLimit
            }
        )

        revalidatePath('/api/keys')

        return {
            success: true,
            data: apiKey,
            message: 'API key created successfully. Save this key - you won\'t see it again!'
        }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getApiKeys() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const keys = await ApiKeyService.getUserApiKeys(session.userId._id.toString())

        return { success: true, data: keys }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function revokeApiKey(keyId: string) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        await ApiKeyService.revokeApiKey(keyId, session.userId._id.toString())

        revalidatePath('/api/keys')

        return { success: true, message: 'API key revoked successfully' }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteApiKey(keyId: string) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        await ApiKeyService.deleteApiKey(keyId, session.userId._id.toString())

        revalidatePath('/api/keys')

        return { success: true, message: 'API key deleted successfully' }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getApiKeyStats(keyId: string) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const stats = await ApiKeyService.getApiKeyStats(
            keyId,
            session.userId._id.toString()
        )

        return { success: true, data: stats }
    } catch (error: any) {
        return { error: error.message }
    }
}
