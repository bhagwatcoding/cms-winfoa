'use server'

import { redirect } from 'next/navigation'
import connectDB from '@/lib/db'
import { User, Session } from '@/models'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function signupAction(prevState: unknown, formData: FormData) {
    try {
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string
        const phone = formData.get('phone') as string
        const role = formData.get('role') as string

        // Validate input
        if (!name || !email || !password || !confirmPassword) {
            return { error: 'All required fields must be filled' }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { error: 'Invalid email format' }
        }

        // Validate password match
        if (password !== confirmPassword) {
            return { error: 'Passwords do not match' }
        }

        // Validate password strength
        if (password.length < 6) {
            return { error: 'Password must be at least 6 characters long' }
        }

        // Connect to database
        await connectDB()

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
        if (existingUser) {
            return { error: 'Email already registered. Please login instead.' }
        }

        // Map UI roles to DB roles
        let userRole = 'student'
        if (role === 'center' || role === 'Center Admin') userRole = 'center'
        else if (role === 'staff' || role === 'Employee') userRole = 'staff'
        else if (role === 'student' || role === 'Student') userRole = 'student'

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = await User.create({
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            name: name.trim(),
            phone: phone?.trim() || '',
            role: userRole,
            status: 'active',
            isActive: true,
            emailVerified: false,
            joinedAt: new Date(),
        })

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
        if (userRole === 'center') {
            redirectUrl = `${protocol}://skills.${rootDomain}`
        } else if (['admin', 'staff'].includes(userRole)) {
            redirectUrl = `${protocol}://center.${rootDomain}`
        }

        // Redirect after successful signup
        redirect(redirectUrl)
    } catch (error: unknown) {
        console.error('Signup action error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.'
        return { error: errorMessage }
    }
}
