import { NextRequest, NextResponse } from 'next/server'
import {
    exchangeCodeForToken,
    getOAuthUserInfo,
    type OAuthProvider
} from '@/auth/lib/oauth/providers'
import { AuthService } from '@/auth/services/auth.service'
import { SessionService } from '@/auth/services/session.service'
import { User } from '@/models'
import connectDB from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ provider: string }> }
) {
    try {
        const { provider: providerParam } = await params
        const provider = providerParam as OAuthProvider
        const searchParams = request.nextUrl.searchParams
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        // Check for OAuth errors
        if (error) {
            console.error(`OAuth error from ${provider}:`, error)
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_cancelled`
            )
        }

        // Validate code
        if (!code) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_failed`
            )
        }

        // Validate provider
        if (provider !== 'google' && provider !== 'github') {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=invalid_provider`
            )
        }

        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`

        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(provider, code, redirectUri)

        // Get user info from OAuth provider
        const oauthUser = await getOAuthUserInfo(provider, accessToken)

        // Connect to database
        await connectDB()

        // Check if user exists
        let user = await User.findOne({ email: oauthUser.email })

        if (user) {
            // User exists - update OAuth info if needed
            if (!user.oauthProvider) {
                user.oauthProvider = provider
                user.oauthId = oauthUser.id
                user.avatar = oauthUser.avatar
                await user.save()
            }
        } else {
            // Create new user from OAuth data
            const [firstName, ...lastNameParts] = oauthUser.name.split(' ')
            const lastName = lastNameParts.join(' ') || firstName

            user = await User.create({
                email: oauthUser.email,
                firstName,
                lastName,
                oauthProvider: provider,
                oauthId: oauthUser.id,
                avatar: oauthUser.avatar,
                emailVerified: true, // OAuth emails are pre-verified
                isActive: true,
                role: 'user',
                password: 'oauth_user_no_password' // Placeholder, won't be used
            })
        }

        // Create session
        await SessionService.createSession(user._id.toString(), {
            userAgent: request.headers.get('user-agent') || 'Unknown',
            ipAddress: request.headers.get('x-forwarded-for') || 'Unknown'
        })

        // Redirect based on role
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

        let redirectUrl = `${protocol}://myaccount.${rootDomain}`

        if (user.role === 'student') {
            redirectUrl = `${protocol}://myaccount.${rootDomain}`
        } else if (['admin', 'staff', 'center'].includes(user.role)) {
            redirectUrl = `${protocol}://center.${rootDomain}/education/dashboard`
        } else if (user.role === 'super-admin') {
            redirectUrl = `${protocol}://god.${rootDomain}`
        }

        return NextResponse.redirect(redirectUrl)
    } catch (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_error`
        )
    }
}
