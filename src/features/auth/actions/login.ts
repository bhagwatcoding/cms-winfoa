'use server'

import { redirect } from 'next/navigation'
import connectDB from '@/lib/db'
import { User, Session } from '@/models'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function loginAction(prevState: unknown, formData: FormData) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // Validate input
        if (!email || !password) {
            return { error: 'Please provide email and password' }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: 'Invalid email format' }
        }

        // Connect to database
        await connectDB()

        // Find user with password
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

        if (!user) {
            return { error: 'Invalid email or password' }
        }

        // Check password
        if (!user.password) {
            return { error: 'Account setup incomplete. Please reset your password.' }
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return { error: 'Invalid email or password' }
        }

        // Check if account is active
        if (!user.isActive || user.status !== 'active') {
            return { error: 'Your account has been disabled. Please contact support.' }
        }

        // Update last login
        user.lastLogin = new Date()
        await user.save()

        // Create session
        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

        await Session.create({
            token,
            userId: user._id,
            expiresAt,
            userAgent: 'unknown',
            ipAddress: 'unknown',
        })

        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('auth_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/',
        })

        // Determine redirect URL based on role
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

        let redirectUrl = `${protocol}://myaccount.${rootDomain}`
        if (user.role === 'skills') {
            redirectUrl = `${protocol}://skills.${rootDomain}`
        } else if (['admin', 'staff', 'super-admin'].includes(user.role)) {
            redirectUrl = `${protocol}://skills.${rootDomain}`
        } else if (user.role === 'super-admin') {
            redirectUrl = `${protocol}://ump.${rootDomain}`
        }

        // Redirect after successful login
        redirect(redirectUrl)
    } catch (error: unknown) {
        console.error('Login action error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
        return { error: errorMessage }
    }
}
