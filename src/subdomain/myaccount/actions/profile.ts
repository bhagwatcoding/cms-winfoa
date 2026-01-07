'use server'

import { revalidatePath } from 'next/cache'
import { ProfileService } from '../services'
import { SessionService } from '@/auth/services/session.service'

export async function getProfile() {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const profile = await ProfileService.getProfile(session.userId._id.toString())
        return { success: true, data: profile }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateProfile(prevState: any, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            phone: formData.get('phone') as string,
        }

        const profile = await ProfileService.updateProfile(
            session.userId._id.toString(),
            data
        )

        revalidatePath('/myaccount/profile')

        return { success: true, data: profile }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function changeEmail(prevState: any, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const newEmail = formData.get('email') as string

        if (!newEmail) {
            return { error: 'Email is required' }
        }

        const user = await ProfileService.changeEmail(
            session.userId._id.toString(),
            newEmail
        )

        revalidatePath('/myaccount/profile')

        return {
            success: true,
            data: user,
            message: 'Email updated. Please verify your new email address.'
        }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteAccount(prevState: any, formData: FormData) {
    try {
        const session = await SessionService.getCurrentSession()

        if (!session) {
            return { error: 'Not authenticated' }
        }

        const confirmation = formData.get('confirmation') as string

        if (confirmation !== 'DELETE') {
            return { error: 'Please type DELETE to confirm' }
        }

        await ProfileService.deleteAccount(session.userId._id.toString())

        // Logout user
        await SessionService.deleteSession()

        return {
            success: true,
            message: 'Account deactivated successfully'
        }
    } catch (error: any) {
        return { error: error.message }
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
    } catch (error: any) {
        return { error: error.message }
    }
}
