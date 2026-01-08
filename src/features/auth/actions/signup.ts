'use server'

import { redirect } from 'next/navigation'
import { AuthService, SessionService } from '../services'

export async function signupAction(prevState: any, formData: FormData) {
    let redirectUrl = '/'

    try {
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string
        const phone = formData.get('phone') as string
        const role = formData.get('role') as string

        // Validate input
        // Allow either 'name' or ('firstName' AND 'lastName')
        if (!(name || (firstName && lastName)) || !email || !password || !confirmPassword) {
            return { error: 'All fields are required' }
        }

        if (password !== confirmPassword) {
            return { error: 'Passwords do not match' }
        }

        // Register user
        const user = await AuthService.register({
            email,
            password,
            firstName,
            lastName,
            name,
            phone,
            role: role || 'user' // Default to user if not provided
        })

        // Create session
        await SessionService.createSession(user._id.toString())

        // Determine redirect URL based on role
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

        // Map roles to subdomains/dashboards
        if (['admin', 'staff'].includes(user.role)) {
            redirectUrl = `${protocol}://ump.${rootDomain}`
        } else if (user.role === 'center') {
            redirectUrl = `${protocol}://skills.${rootDomain}`
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
