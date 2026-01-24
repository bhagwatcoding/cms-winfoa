/**
 * Account Settings Actions
 * Server actions for settings management
 */

'use server'

import { revalidatePath } from 'next/cache'
import { SettingsService } from '@/services/account'
import { SessionService } from '@/services/session'
import { getErrorMessage } from '@/lib/utils'
import { validateSchema } from '@/shared/types/validation.utils'
import {
    updateUserPreferencesSchema,
    changePasswordSchema,
    userPreferencesSchema,
    notificationPreferencesSchema,
    privacySettingsSchema,
} from '@/types/schemas';

export async function getPreferences() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const preferences = await SettingsService.getPreferences(session.userId._id.toString())
        return { success: true, data: preferences }
    } catch (error) {
        console.error('Get preferences error:', error)
        return { error: getErrorMessage(error) }
    }
}

export async function updatePreferences(formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const preferencesData = {
            language: formData.get('language') as string,
            timezone: formData.get('timezone') as string,
            theme: formData.get('theme') as string,
            emailNotifications: formData.get('emailNotifications') === 'true',
            pushNotifications: formData.get('pushNotifications') === 'true',
            smsNotifications: formData.get('smsNotifications') === 'true',
            marketingEmails: formData.get('marketingEmails') === 'true',
        }

        const validation = validateSchema(updateUserPreferencesSchema, preferencesData)
        if (!validation.success) {
            return { error: 'Validation failed', errors: validation.errors }
        }

        const updatedPreferences = await SettingsService.updatePreferences(
            session.userId._id.toString(),
            validation.data
        )

        revalidatePath('/myaccount/settings')
        return { success: true, data: updatedPreferences }
    } catch (error) {
        console.error('Update preferences error:', error)
        return { error: getErrorMessage(error) }
    }
}

export async function changePassword(formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const passwordData = {
            currentPassword: formData.get('currentPassword') as string,
            newPassword: formData.get('newPassword') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        }

        const validation = validateSchema(changePasswordSchema, passwordData)
        if (!validation.success) {
            return { error: 'Validation failed', errors: validation.errors }
        }

        const result = await SettingsService.changePassword(
            session.userId._id.toString(),
            validation.data.currentPassword,
            validation.data.newPassword
        )

        return { success: true, data: result }
    } catch (error) {
        console.error('Change password error:', error)
        return { error: getErrorMessage(error) }
    }
}