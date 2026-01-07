'use server'

import { redirect } from 'next/navigation'
import { AuthService, SessionService } from '../services'

export async function loginAction(prevState: any, formData: FormData) {
    let redirectUrl = '/'

    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // Validate input
        if (!email || !password) {
            return { error: 'Please provide email and password' }
        }

        // Authenticate user
        const user = await AuthService.authenticate(email, password)

        // Create session
        await SessionService.createSession(user._id.toString())

        // Determine redirect URL based on role
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

        if (user.role === 'student') {
            redirectUrl = `${protocol}://myaccount.${rootDomain}`
        } else if (['admin', 'staff', 'center'].includes(user.role)) {
            redirectUrl = `${protocol}://center.${rootDomain}/education/dashboard`
        } else if (user.role === 'super-admin') {
            redirectUrl = `${protocol}://god.${rootDomain}`
        } else {
            redirectUrl = `${protocol}://myaccount.${rootDomain}`
        }

    } catch (error: any) {
        console.error('Login action error:', error)
        return {
            error: error.message || 'Login failed. Please try again.'
        }
    }

    // Redirect after successful login
    redirect(redirectUrl)
}
