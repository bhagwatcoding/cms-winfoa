import { UserRegistry } from '@/models'
import connectDB from '@/lib/db'

export class UserIdService {
    /**
     * Generate unique user ID
     */
    static async generateUserId(): Promise<string> {
        await connectDB()
        const userId = await (UserRegistry as { generateUserId: () => Promise<string> }).generateUserId()
        return userId
    }

    /**
     * Register new user in UMP registry
     */
    static async registerUser(data: {
        email: string
        role: string
        createdBy?: string
        metadata?: Record<string, unknown>
    }) {
        await connectDB()

        // Check if email already registered
        const existing = await UserRegistry.findOne({ email: data.email })
        if (existing) {
            throw new Error('User already registered in UMP')
        }

        // Generate unique ID
        const userId = await this.generateUserId()

        // Create registry entry
        const registry = await UserRegistry.create({
            userId,
            email: data.email,
            role: data.role,
            status: 'pending',
            createdBy: data.createdBy,
            metadata: data.metadata || {}
        })

        return {
            userId: registry.userId,
            registryId: registry._id
        }
    }

    /**
     * Activate user after successful creation
     */
    static async activateUser(userId: string) {
        await connectDB()

        const registry = await UserRegistry.findOneAndUpdate(
            { userId },
            { status: 'active' },
            { new: true }
        )

        if (!registry) {
            throw new Error('User not found in registry')
        }

        return registry
    }

    /**
     * Get user by ID
     */
    static async getUserById(userId: string) {
        await connectDB()

        const registry = await UserRegistry.findOne({ userId })
        return registry
    }

    /**
     * Get user by email
     */
    static async getUserByEmail(email: string) {
        await connectDB()

        const registry = await UserRegistry.findOne({ email })
        return registry
    }

    /**
     * Get all registered users
     */
    static async getAllUsers(options: {
        page?: number
        limit?: number
        status?: string
        role?: string
    } = {}) {
        await connectDB()

        const { page = 1, limit = 50, status, role } = options
        const skip = (page - 1) * limit

        const filter: Record<string, unknown> = {}
        if (status) filter.status = status
        if (role) filter.role = role

        const users = await UserRegistry
            .find(filter)
            .sort({ registeredAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await UserRegistry.countDocuments(filter)

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    }

    /**
     * Deactivate user
     */
    static async deactivateUser(userId: string) {
        await connectDB()

        const registry = await UserRegistry.findOneAndUpdate(
            { userId },
            { status: 'inactive' },
            { new: true }
        )

        if (!registry) {
            throw new Error('User not found in registry')
        }

        return registry
    }

    /**
     * Get user statistics
     */
    static async getStatistics() {
        await connectDB()

        const stats = await UserRegistry.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    active: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    inactive: {
                        $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    }
                }
            }
        ])

        const byRole = await UserRegistry.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ])

        return {
            total: stats[0]?.total || 0,
            active: stats[0]?.active || 0,
            inactive: stats[0]?.inactive || 0,
            pending: stats[0]?.pending || 0,
            byRole: byRole.reduce((acc: Record<string, number>, item: { _id: string; count: number }) => {
                acc[item._id] = item.count
                return acc
            }, {})
        }
    }
}
