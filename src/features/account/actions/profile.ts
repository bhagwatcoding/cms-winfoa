'use server'

import { revalidatePath } from 'next/cache'
import { ProfileService } from '../services'
import { SessionService } from '@/auth/services/session.service'
import { getErrorMessage } from '@/lib/utils'
import { updateProfileSchema } from '@/lib/validations'
import { validateSchema } from '@/lib/validations/utils'
import { changeEmailSchema, accountDeletionSchema } from '@/lib/validations/account.validation'

export async function getProfile() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const profile = await ProfileService.getProfile(session.userId._id.toString())
        return { success: true, data: profile }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function updateProfile(prevState: unknown, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const rawData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
        }

        const validation = validateSchema(updateProfileSchema, rawData);
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid input' }
        }

        const profile = await ProfileService.updateProfile(
            session.userId._id.toString(),
            validation.data!
        )

        revalidatePath('/myaccount/profile')

        return { success: true, data: profile }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function changeEmail(prevState: unknown, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const rawEmail = formData.get('email') as string

        const validation = validateSchema(changeEmailSchema, { email: rawEmail });
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid email' }
        }

        const user = await ProfileService.changeEmail(
            session.userId._id.toString(),
            validation.data!.email
        )

        revalidatePath('/myaccount/profile')

        return {
            success: true,
            data: user,
            message: 'Email updated. Please verify your new email address.'
        }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function deleteAccount(prevState: unknown, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const confirmation = formData.get('confirmation') as string

        const validation = validateSchema(accountDeletionSchema, { confirmation });
        if (!validation.success) {
            return { error: validation.errors?.[0]?.message || 'Invalid confirmation' }
        }

        await ProfileService.deleteAccount(session.userId._id.toString())

        // Logout user
        await SessionService.deleteSession()

        return {
            success: true,
            message: 'Account deactivated successfully'
        }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}

export async function getUserStats() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const stats = await ProfileService.getUserStats(session.userId._id.toString())
        return { success: true, data: stats }
    } catch (error) {
        return { error: getErrorMessage(error) }
    }
}
