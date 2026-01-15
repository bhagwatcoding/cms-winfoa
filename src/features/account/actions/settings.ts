'use server'

import { revalidatePath } from 'next/cache'
import { SettingsService } from '../services'
import { SessionService } from '@/auth/services/session.service'
import { getErrorMessage } from '@/lib/utils'
import { updateUserPreferencesSchema } from '@/shared/lib/utils/validations'
import { validateSchema } from '@/shared/lib/utils/validations/utils'
import {
    settingsChangePasswordSchema,
    emailNotifSchema,
    pushNotifSchema,
    privacySchema,
    themeSchema
} from '@/shared/lib/utils/validations/settings.validation'

export async function getPreferences() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const prefs = await SettingsService.getPreferences(session.userId._id.toString())
        return { success: true, data: prefs }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function updatePreferences(prevState: unknown, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        // Parse JSON data from form
        const prefsData = formData.get('preferences')
        const rawData = prefsData ? JSON.parse(prefsData as string) : {}

        const validation = validateSchema(updateUserPreferencesSchema, rawData);
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid preferences' }
        }

        const prefs = await SettingsService.updatePreferences(
            session.userId._id.toString(),
            validation.data!
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function changePassword(prevState: unknown, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const currentPassword = formData.get('currentPassword') as string
        const newPassword = formData.get('newPassword') as string
        const confirmPassword = formData.get('confirmPassword') as string

        const validation = validateSchema(settingsChangePasswordSchema, {
            currentPassword,
            newPassword,
            confirmPassword
        });

        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid password data' }
        }

        const result = await SettingsService.changePassword(
            session.userId._id.toString(),
            validation.data!.currentPassword,
            validation.data!.newPassword
        )

        revalidatePath('/myaccount/security')

        return { success: true, message: result.message }
    } catch (error) {
        return { error: getErrorMessage(error) }
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

        const validation = validateSchema(emailNotifSchema, data);
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid data' }
        }

        const prefs = await SettingsService.updateEmailNotifications(
            session.userId._id.toString(),
            validation.data!
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error) {
        return { error: getErrorMessage(error) }
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

        const validation = validateSchema(pushNotifSchema, data);
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid data' }
        }

        const prefs = await SettingsService.updatePushNotifications(
            session.userId._id.toString(),
            validation.data!
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error) {
        return { error: getErrorMessage(error) }
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

        const validation = validateSchema(privacySchema, data);
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid data' }
        }

        const prefs = await SettingsService.updatePrivacySettings(
            session.userId._id.toString(),
            validation.data!
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function updateTheme(theme: 'light' | 'dark' | 'system') {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const validation = validateSchema(themeSchema, theme);
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid theme' }
        }

        const prefs = await SettingsService.updateTheme(
            session.userId._id.toString(),
            validation.data!
        )

        revalidatePath('/myaccount/settings')

        return { success: true, data: prefs }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}
