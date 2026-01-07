import User from '@/edu/models/User'
import ActivityLog from '../models/ActivityLog'
import connectDB from '@/lib/db'

export class ProfileService {
    /**
     * Get user profile
     */
    static async getProfile(userId: string) {
        await connectDB()

        const user = await User.findById(userId)
            .select('-password')
            .lean()

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }

    /**
     * Update user profile
     */
    static async updateProfile(
        userId: string,
        data: {
            firstName?: string
            lastName?: string
            phone?: string
            avatar?: string
            name?: string
        }
    ) {
        await connectDB()

        // Update name if firstName/lastName changed
        if (data.firstName || data.lastName) {
            const user = await User.findById(userId)
            if (user) {
                const firstName = data.firstName || user.firstName || ''
                const lastName = data.lastName || user.lastName || ''
                data.name = `${firstName} ${lastName}`.trim()
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            throw new Error('User not found')
        }

        // Log activity
        await ActivityLog.create({
            userId,
            action: 'profile_update',
            resource: 'profile',
            details: { fields: Object.keys(data) }
        })

        return user
    }

    /**
     * Change email
     */
    static async changeEmail(userId: string, newEmail: string) {
        await connectDB()

        // Check if email is already taken
        const existing = await User.findOne({
            email: newEmail.toLowerCase().trim(),
            _id: { $ne: userId }
        })

        if (existing) {
            throw new Error('This email is already in use')
        }

        // Update email and mark as unverified
        const user = await User.findByIdAndUpdate(
            userId,
            {
                email: newEmail.toLowerCase().trim(),
                emailVerified: false
            },
            { new: true }
        ).select('-password')

        if (!user) {
            throw new Error('User not found')
        }

        // Log activity
        await ActivityLog.create({
            userId,
            action: 'email_change',
            resource: 'profile',
            details: { newEmail }
        })

        // TODO: Send verification email to new address

        return user
    }

    /**
     * Upload avatar
     */
    static async uploadAvatar(userId: string, avatarUrl: string) {
        await connectDB()

        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password')

        if (!user) {
            throw new Error('User not found')
        }

        await ActivityLog.create({
            userId,
            action: 'profile_update',
            resource: 'avatar',
            details: { avatarUrl }
        })

        return user
    }

    /**
     * Delete account (soft delete)
     */
    static async deleteAccount(userId: string) {
        await connectDB()

        // Log before deletion
        await ActivityLog.create({
            userId,
            action: 'account_delete',
            resource: 'account',
            details: { deletedAt: new Date() }
        })

        // Soft delete
        await User.findByIdAndUpdate(userId, {
            isActive: false,
            status: 'inactive'
        })

        // Or hard delete (uncomment if needed):
        // await User.findByIdAndDelete(userId)
        // await ActivityLog.deleteMany({ userId })
        // await UserPreferences.findOneAndDelete({ userId })

        return { success: true, message: 'Account deactivated' }
    }

    /**
     * Get user statistics
     */
    static async getUserStats(userId: string) {
        await connectDB()

        const user = await User.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }

        // Get activity count
        const activityCount = await ActivityLog.countDocuments({ userId })

        // Get recent activities
        const recentActivities = await ActivityLog
            .find({ userId })
            .sort({ timestamp: -1 })
            .limit(10)
            .lean()

        return {
            memberSince: user.joinedAt || user.createdAt,
            lastLogin: user.lastLogin,
            totalActivities: activityCount,
            recentActivities,
            emailVerified: user.emailVerified,
            oauthConnected: !!user.oauthProvider
        }
    }
}
