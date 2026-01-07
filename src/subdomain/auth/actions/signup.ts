'use server'

import { redirect } from 'next/navigation'
import { AuthService, SessionService } from '../services'

export async function signupAction(prevState: any, formData: FormData) {
    let redirectUrl = '/'

    try {
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        // Validate input
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return { error: 'All fields are required' }
        }

        // Register user
        const user = await AuthService.register({
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            role: 'user' // Default role
        })

        // Create session
        await SessionService.createSession(user._id.toString())

        // Determine redirect URL based on role
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

        if (user.role === 'student') {
            redirectUrl = `${protocol}://myaccount.${rootDomain}`
        } else if (['admin', 'staff', 'center'].includes(user.role)) {
            redirectUrl = `${protocol}://center.${rootDomain}/education/dashboard`
        } else {
            redirectUrl = `${protocol}://myaccount.${rootDomain}`
        }

    } catch (error: any) {
        console.error('Signup action error:', error)
        return {
            error: error.message || 'Signup failed. Please try again.'
        }
    }

    // Redirect after successful signup
    redirect(redirectUrl)
}
