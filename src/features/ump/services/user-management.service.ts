import { User, UserRegistry } from '@/models'
import connectDB from '@/lib/db'
import bcrypt from 'bcryptjs'

export class UserManagementService {
    /**
     * Get all users with filters
     */
    static async getAll(filters?: {
        role?: string
        status?: string
        search?: string
    }) {
        await connectDB()

        const query: any = {}

        if (filters?.role) query.role = filters.role
        if (filters?.status) query.status = filters.status
        if (filters?.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } }
            ]
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean()

        return users
    }

    /**
     * Get user by ID
     */
    static async getById(id: string) {
        await connectDB()

        const user = await User.findById(id)
            .select('-password')
            .lean()

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }

    /**
     * Create user
     */
    static async create(data: {
        name: string
        email: string
        password: string
        phone?: string
        role?: string
        createdBy?: string
    }) {
        await connectDB()

        // Check if email exists
        const existing = await User.findOne({ email: data.email })
        if (existing) {
            throw new Error('Email already exists')
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12)

        // Create user
        const user = await User.create({
            ...data,
            password: hashedPassword,
            status: 'active',
            joinedAt: new Date()
        })

        // Create registry entry
        await UserRegistry.create({
            userId: user._id,
            registeredBy: data.createdBy || 'system',
            source: 'admin'
        })

        return user
    }

    /**
     * Update user
     */
    static async update(id: string, data: any) {
        await connectDB()

        // If password provided, hash it
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12)
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password')

        if (!user) {
            throw new Error('User not found')
        }

        return user
    }

    /**
     * Delete user
     */
    static async delete(id: string) {
        await connectDB()

        const user = await User.findByIdAndDelete(id)

        if (!user) {
            throw new Error('User not found')
        }

        // Delete registry
        await UserRegistry.findOneAndDelete({ userId: id })

        return user
    }

    /**
     * Get statistics
     */
    static async getStats() {
        await connectDB()

        const [total, active, inactive, suspended, roles] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ status: 'inactive' }),
            User.countDocuments({ status: 'suspended' }),
            User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ])
        ])

        const byRole: any = {}
        roles.forEach((r: any) => {
            byRole[r._id] = r.count
        })

        return {
            total,
            active,
            inactive,
            suspended,
            byRole
        }
    }

    /**
     * Toggle user status
     */
    static async toggleStatus(id: string) {
        await connectDB()

        const user = await User.findById(id)
        if (!user) {
            throw new Error('User not found')
        }

        user.status = user.status === 'active' ? 'inactive' : 'active'
        await user.save()

        return user
    }
}
