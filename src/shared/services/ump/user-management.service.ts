import { User, UserRegistry, Role } from '@/models';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { UserStatus } from '@/core/types/enums';

export class UserManagementService {
  /**
   * Get all users with filters
   */
  static async getAll(filters?: { role?: string; status?: string; search?: string }) {
    await connectDB();

    const query: Record<string, unknown> = {};

    if (filters?.role) {
      const role = await Role.findOne({ slug: filters.role });
      if (role) {
        query.roleId = role._id;
      } else {
        return []; // Role not found, so no users
      }
    }

    if (filters?.status) query.status = filters.status;
    if (filters?.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('roleId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return users;
  }

  /**
   * Get user by ID
   */
  static async getById(id: string) {
    await connectDB();

    const user = await User.findById(id).select('-password').lean();

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Create user
   */
  static async create(data: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    createdBy?: string;
  }) {
    await connectDB();

    // Check if email exists
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new Error('Email already exists');
    }

    // Get Role ID
    const roleSlug = data.role || 'user';
    const role = await Role.findOne({ slug: roleSlug });
    if (!role) {
      throw new Error(`Role not found: ${roleSlug}`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await User.create({
      firstName: data.firstName || 'User',
      lastName: data.lastName || 'Name',
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      roleId: role._id,
      status: UserStatus.Active,
    });

    // Create registry entry
    await UserRegistry.create({
      userId: user._id.toString(),
      registeredBy: data.createdBy || 'system',
      source: 'admin',
    });

    return user;
  }

  /**
   * Update user
   */
  static async update(id: string, data: Partial<Record<string, unknown>>) {
    await connectDB();

    // If password provided, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 12);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Delete user
   */
  static async delete(id: string) {
    await connectDB();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new Error('User not found');
    }

    // Delete registry
    await UserRegistry.findOneAndDelete({ userId: id });

    return user;
  }

  /**
   * Get statistics
   */
  static async getStats() {
    await connectDB();

    const [total, active, inactive, suspended, roles] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: UserStatus.Active }),
      User.countDocuments({ status: UserStatus.Inactive }),
      User.countDocuments({ status: UserStatus.Suspended }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    ]);

    const byRole: Record<string, number> = {};
    roles.forEach((r: { _id: string; count: number }) => {
      byRole[r._id] = r.count;
    });

    return {
      total,
      active,
      inactive,
      suspended,
      byRole,
    };
  }

  /**
   * Toggle user status
   */
  static async toggleStatus(id: string) {
    await connectDB();

    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;
    await user.save();

    return user;
  }
}
