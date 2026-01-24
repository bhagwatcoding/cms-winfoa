/**
 * Account Profile Actions
 * Server actions for profile management
 */

'use server'

import { revalidatePath } from 'next/cache'
import { ProfileService } from '@/services/account'
import { SessionService } from '@/services/session'
import { getErrorMessage } from '@/lib/utils'
import { validateSchema } from '@/shared/types/validation.utils'
import { updateProfileSchema,changeEmailSchema, accountDeletionSchema } from '@/types/schemas'

export async function getProfile() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const profile = await ProfileService.getProfile(session.userId._id.toString())
        return { success: true, data: profile }
    } catch (error) {
        console.error('Get profile error:', error)
        return { error: getErrorMessage(error) }
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const profileData = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            phone: formData.get('phone') as string,
            avatar: formData.get('avatar') as string,
        }

        const validation = validateSchema(updateProfileSchema, profileData)
        if (!validation.success) {
            return { error: 'Validation failed', errors: validation.errors }
        }

        const updatedProfile = await ProfileService.updateProfile(
            session.userId._id.toString(),
            validation.data
        )

        revalidatePath('/myaccount')
        return { success: true, data: updatedProfile }
    } catch (error) {
        console.error('Update profile error:', error)
        return { error: getErrorMessage(error) }
    }
}

export async function changeEmail(formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const emailData = {
            newEmail: formData.get('newEmail') as string,
            password: formData.get('password') as string,
        }

        const validation = validateSchema(changeEmailSchema, emailData)
        if (!validation.success) {
            return { error: 'Validation failed', errors: validation.errors }
        }

        const result = await ProfileService.changeEmail(
            session.userId._id.toString(),
            validation.data.newEmail,
            validation.data.password
        )

        return { success: true, data: result }
    } catch (error) {
        console.error('Change email error:', error)
        return { error: getErrorMessage(error) }
    }
}

export async function deleteAccount(formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const deletionData = {
            password: formData.get('password') as string,
            reason: formData.get('reason') as string,
            confirmText: formData.get('confirmText') as string,
        }

        const validation = validateSchema(accountDeletionSchema, deletionData)
        if (!validation.success) {
            return { error: 'Validation failed', errors: validation.errors }
        }

        const result = await ProfileService.deleteAccount(
            session.userId._id.toString(),
            validation.data.password,
            validation.data.reason
        )

        return { success: true, data: result }
    } catch (error) {
        console.error('Delete account error:', error)
        return { error: getErrorMessage(error) }
    }
}