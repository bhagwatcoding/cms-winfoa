import { User } from '@/models';
import type { IUser, UserRole } from '@/types/models';
import type { CreateUserInput, UpdateUserInput } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { QueryFilter } from 'mongoose';

export class UserService {
    /**
     * Create a new user
     */
    static async createUser(data: CreateUserInput): Promise<IUser> {
        // Check if email already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password if provided
        let hashedPassword: string | undefined;
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10);
        }

        // Create user
        const user = await User.create({
            ...data,
            password: hashedPassword,
            status: data.status || 'active',
            joinedAt: new Date(),
            emailVerified: data.emailVerified || false,
            isActive: data.isActive !== false,
        });

        return user.toObject();
    }

    /**
     * Find user by ID
     */
    static async getUserById(userId: string): Promise<IUser | null> {
        const user = await User.findById(userId).lean();
        return user as IUser | null;
    }

    /**
     * Update user
     */
    static async updateUser(userId: string, data: UpdateUserInput): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) {
            return null;
        }

        // Check if email is being changed and already exists
        if (data.email && data.email !== user.email) {
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                throw new Error('Email already registered');
            }
        }

        Object.assign(user, data);
        await user.save();

        return user.toObject();
    }

    /**
     * Delete user
     */
    static async deleteUser(userId: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(userId);
        return !!result;
    }

    /**
     * Get paginated users
     */
    static async getUsers(params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: UserRole;
        status?: string;
    }) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const query: QueryFilter<IUser> = {};

        if (params.search) {
            query.$or = [
                { name: { $regex: params.search, $options: 'i' } },
                { email: { $regex: params.search, $options: 'i' } },
            ];
        }

        if (params.role) {
            query.role = params.role;
        }

        if (params.status) {
            query.status = params.status;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean(),
            User.countDocuments(query),
        ]);

        return {
            users: users as IUser[],
            total,
            totalPages: Math.ceil(total / limit),
            page,
            limit
        };
    }

    /**
     * Change user role
     */
    static async changeRole(userId: string, role: UserRole): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        user.role = role;
        await user.save();

        return user.toObject();
    }

    /**
     * Toggle user status
     */
    static async toggleStatus(userId: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) return null;

        user.isActive = !user.isActive;
        // Sync status string with boolean
        if (user.isActive) {
            user.status = 'active';
        } else {
            // Check if we strictly map isActive=false to 'inactive'
            user.status = 'inactive';
        }

        await user.save();

        return user.toObject();
    }
}
