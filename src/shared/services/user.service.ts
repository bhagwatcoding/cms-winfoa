import 'server-only';
import { headers } from 'next/headers';
import { User, IUser, ActivityLog } from '@/models';
import { ActionType, ResourceType } from '@/core/db/interfaces';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { UserRole, UserRoleLabels, UserStatus } from '@/core/db/enums';

// Configuration
const GOD_SUBDOMAIN = UserRoleLabels[UserRole.God];

export class UserService {
  /**
   * Helper: Checks if current request is from God Subdomain
   */
  private static async isGodMode(): Promise<boolean> {
    const headerStore = await headers();
    const host = headerStore.get('host') || '';
    return host.startsWith(`${GOD_SUBDOMAIN}.`);
  }

  /**
   * 1. GET ALL USERS
   */
  static async getAllUsers() {
    await connectDB();
    const isGod = await this.isGodMode();
    const query = isGod ? {} : { isDeleted: false };
    return User.find(query).select('-password').lean();
  }

  /**
   * 2. DELETE USER (Soft Delete)
   */
  static async deleteUser(actorId: string, targetUserId: string) {
    await connectDB();

    const target = await User.findById(targetUserId);
    if (target?.isGod) throw new Error('Cannot delete a God user');

    const updatedUser = await User.findByIdAndUpdate(targetUserId, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: actorId,
    });

    try {
      await ActivityLog.create({
        actorId,
        action: ActionType.SoftDelete,
        resource: ResourceType.User,
        resourceId: targetUserId,
        details: 'User deleted their account (Soft Delete)',
      });
    } catch (e) {
      console.error('ActivityLog failed', e);
    }

    return updatedUser;
  }

  /**
   * 3. RESTORE USER (God Mode Only)
   */
  static async restoreUser(actorId: string, targetUserId: string) {
    await connectDB();

    if (!(await this.isGodMode())) {
      throw new Error('Unauthorized: Only God Subdomain can restore users');
    }

    await User.findByIdAndUpdate(targetUserId, {
      isDeleted: false,
      $unset: { deletedAt: 1, deletedBy: 1 },
    });

    try {
      await ActivityLog.create({
        actorId,
        action: ActionType.Restore,
        resource: ResourceType.User,
        resourceId: targetUserId,
        details: 'God restored this user',
      });
    } catch (e) {
      console.error('ActivityLog failed', e);
    }
  }

  /**
   * 4. CREATE USER
   */
  static async createUser(data: Partial<IUser>) {
    await connectDB();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    let password = data.password;
    if (password) {
      password = await bcrypt.hash(password, 12);
    }

    const user = await User.create({
      ...data,
      password,
      status: data.status || UserStatus.Active,
    });

    return user.toObject();
  }

  /**
   * 5. UPDATE USER
   */
  static async updateUser(userId: string, data: Partial<IUser>) {
    await connectDB();

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    const user = await User.findByIdAndUpdate(userId, data, { new: true });

    if (!user) return null;

    return user.toObject();
  }

  /**
   * 6. GET USER BY ID
   */
  static async getUserById(userId: string) {
    await connectDB();
    return User.findById(userId).select('-password').lean();
  }

  /**
   * 7. GET USERS (Paginated/Filtered)
   */
  static async getUsers(params: { page?: number; limit?: number; search?: string; role?: string }) {
    await connectDB();
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { isDeleted: false };

    if (params.search) {
      query['$text'] = { $search: params.search };
    }

    if (params.role && params.role !== 'all') {
      // Role filtering
    }

    const users = await User.find(query).select('-password').skip(skip).limit(limit).lean();
    const total = await User.countDocuments(query);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  /**
   * 8. CHANGE ROLE
   */
  static async changeRole(userId: string, role: string) {
    await connectDB();
    // Assuming role arg is just string for now, but User uses Role ref.
    // This method is likely broken if role string != roleId, but keeping signature for now.
    return User.findByIdAndUpdate(userId, { role }, { new: true });
  }

  /**
   * 9. TOGGLE STATUS
   */
  static async toggleStatus(userId: string) {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const newStatus = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;
    user.status = newStatus;
    return user.save();
  }
}
