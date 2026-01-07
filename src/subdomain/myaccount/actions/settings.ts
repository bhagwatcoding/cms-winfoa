'use server'

import { revalidatePath } from 'next/cache'
import { SettingsService } from '../services'
import { SessionService } from '@/auth/services/session.service'

export async function getPreferences() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const prefs = await SettingsService.getPreferences(session.userId._id.toString())
        return { success: true, data: prefs }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updatePreferences(prevState: any, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        // Parse JSON data from form
        const prefsData = formData.get('preferences')
        const data = prefsData ? JSON.parse(prefsData as string) : {}

        const prefs = await SettingsService.updatePreferences(
            session.userId._id.toString(),
            data
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const currentPassword = formData.get('currentPassword') as string
        const newPassword = formData.get('newPassword') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!newPassword || !confirmPassword) {
            return { error: 'All fields are required' }
        }

        if (newPassword !== confirmPassword) {
            return { error: 'New passwords do not match' }
        }

        const result = await SettingsService.changePassword(
            session.userId._id.toString(),
            currentPassword,
            newPassword
        )

        revalidatePath('/myaccount/security')

        return { success: true, message: result.message }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateEmailNotifications(data: {
    marketing?: boolean
    updates?: boolean
    security?: boolean
    newsletter?: boolean
}) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const prefs = await SettingsService.updateEmailNotifications(
            session.userId._id.toString(),
            data
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updatePushNotifications(data: {
    enabled?: boolean
    browser?: boolean
    mobile?: boolean
}) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const prefs = await SettingsService.updatePushNotifications(
            session.userId._id.toString(),
            data
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updatePrivacySettings(data: {
    profileVisibility?: 'public' | 'private' | 'friends'
    showEmail?: boolean
    showActivity?: boolean
}) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const prefs = await SettingsService.updatePrivacySettings(
            session.userId._id.toString(),
            data
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateTheme(theme: 'light' | 'dark' | 'system') {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const prefs = await SettingsService.updateTheme(
            session.userId._id.toString(),
            theme
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error: any) {
        return { error: error.message }
    }
}
