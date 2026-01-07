import { cookies } from 'next/headers'
import Session from '@/edu/models/Session'
import connectDB from '@/lib/db'
import crypto from 'crypto'

const SESSION_COOKIE_NAME = 'session_id'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export class SessionService {
    /**
     * Create new session for user
     */
    static async createSession(
        userId: string,
        metadata?: {
            userAgent?: string
            ipAddress?: string
        }
    ) {
        await connectDB()

        const sessionToken = crypto.randomUUID()
        const expiresAt = new Date(Date.now() + SESSION_DURATION)

        // Create session in database
        await Session.create({
            userId,
            sessionToken,
            expiresAt,
            userAgent: metadata?.userAgent || 'Unknown',
            ipAddress: metadata?.ipAddress || 'Unknown',
            createdAt: new Date()
        })

        // Set HTTP-only cookie
        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/'
        })

        return sessionToken
    }

    /**
     * Get current session from cookie
     */
    static async getCurrentSession() {
        try {
            const cookieStore = await cookies()
            const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

            if (!sessionToken) {
                return null
            }

            await connectDB()

            // Find valid session
            const session = await Session.findOne({
                sessionToken,
                expiresAt: { $gt: new Date() }
            }).populate('userId')

            if (!session) {
                // Session expired or invalid, clear cookie
                cookieStore.delete(SESSION_COOKIE_NAME)
                return null
            }

            return session
        } catch (error) {
            console.error('Error getting session:', error)
            return null
        }
    }

    /**
     * Get current user from session
     */
    static async getCurrentUser() {
        const session = await this.getCurrentSession()
        return session?.userId || null
    }

    /**
     * Validate session token
     */
    static async validateSession(sessionToken: string) {
        await connectDB()

        const session = await Session.findOne({
            sessionToken,
            expiresAt: { $gt: new Date() }
        })

        return !!session
    }

    /**
     * Delete session (logout)
     */
    static async deleteSession(sessionToken?: string) {
        const cookieStore = await cookies()

        // Get token from parameter or cookie
        if (!sessionToken) {
            sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
        }

        if (sessionToken) {
            await connectDB()

            // Delete from database
            await Session.deleteOne({ sessionToken })
        }

        // Clear cookie
        cookieStore.delete(SESSION_COOKIE_NAME)

        return { success: true }
    }

    /**
     * Delete all sessions for a user
     */
    static async deleteAllUserSessions(userId: string) {
        await connectDB()

        await Session.deleteMany({ userId })

        return { success: true }
    }

    /**
     * Get all active sessions for a user
     */
    static async getUserSessions(userId: string) {
        await connectDB()

        const sessions = await Session.find({
            userId,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 })

        return sessions
    }

    /**
     * Cleanup expired sessions (run periodically)
     */
    static async cleanupExpiredSessions() {
        await connectDB()

        const result = await Session.deleteMany({
            expiresAt: { $lt: new Date() }
        })

        return {
            success: true,
            deletedCount: result.deletedCount
        }
    }

    /**
     * Extend session expiry
     */
    static async extendSession(sessionToken: string) {
        await connectDB()

        const newExpiresAt = new Date(Date.now() + SESSION_DURATION)

        await Session.updateOne(
            { sessionToken },
            { $set: { expiresAt: newExpiresAt } }
        )

        // Update cookie
        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: newExpiresAt,
            path: '/'
        })

        return { success: true }
    }
}
