import bcrypt from 'bcryptjs'
import { User } from '@/models'
import connectDB from '@/lib/db'
import { UserIdService } from '@/admin/services/userid.service'
import crypto from 'crypto'

export class AuthService {
    /**
     * Authenticate user with email and password
     */
    static async authenticate(email: string, password: string) {
        await connectDB()

        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            throw new Error('Invalid email or password')
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            throw new Error('Invalid email or password')
        }

        if (!user.isActive) {
            throw new Error('Your account has been disabled. Please contact support.')
        }

        // Update last login
        user.lastLogin = new Date()
        await user.save()

        return user
    }

    /**
     * Register new user
     */
    static async register(userData: {
        email: string
        password: string
        firstName?: string
        lastName?: string
        name?: string
        phone?: string
        role?: string
        oauthProvider?: string
        oauthId?: string
        emailVerified?: boolean
    }) {
        await connectDB()

        // Check if user already exists
        const existingUser = await User.findOne({
            email: userData.email.toLowerCase().trim()
        })

        if (existingUser) {
            throw new Error('User with this email already exists')
        }

        // Register in UMP and get unique user ID
        const umpRegistration = await UserIdService.registerUser({
            email: userData.email.toLowerCase().trim(),
            role: userData.role || 'user',
            metadata: {
                subdomain: 'auth',
                source: 'signup',
                registeredAt: new Date()
            }
        })

        // Generate full name if not provided
        const name = userData.name ||
            `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
            userData.email.split('@')[0]

        // Create user with UMP-generated ID
        const user = await User.create({
            email: userData.email.toLowerCase().trim(),
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name,
            phone: userData.phone,
            role: userData.role || 'user',
            oauthProvider: userData.oauthProvider,
            oauthId: userData.oauthId,
            emailVerified: userData.emailVerified || false,
            isActive: true,
            umpUserId: umpRegistration.userId
        })

        // Activate user in UMP after successful creation
        await UserIdService.activateUser(umpRegistration.userId)

        return user
    }

    /**
     * Hash password
     */
    static async hashPassword(password: string) {
        return bcrypt.hash(password, 12)
    }

    /**
     * Send verification email (stub)
     */
    static async sendVerificationEmail(user: { email: string; name?: string }) {
        const token = crypto.randomBytes(32).toString('hex')
        const url = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

        console.log(`[DEV] Verification URL for ${user.email}: ${url}`)

        return { token, url }
    }

    /**
     * Request password reset (stub)
     */
    static async requestPasswordReset(email: string) {
        await connectDB()

        const user = await User.findOne({ email })

        if (!user) {
            return {
                success: true,
                message: 'If an account exists, a reset email has been sent'
            }
        }

        const token = crypto.randomBytes(32).toString('hex')
        console.log(`[DEV] Reset URL for ${user.email}: /auth/reset-password?token=${token}`)

        return {
            success: true,
            message: 'If an account exists, a reset email has been sent'
        }
    }

    /**
     * Validate password strength
     */
    static validatePassword(password: string): {
        isValid: boolean
        errors: string[]
    } {
        const errors: string[] = []

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long')
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }
}
