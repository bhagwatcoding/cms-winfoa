import { QueryFilter, Types, SortOrder } from 'mongoose';
import { User } from '@/core/db/models';
import { IUser } from '@/core/db/interfaces';
import { UserStatus } from '@/core/db/enums';

/**
 * Service for User Management
 * Handles all CRUD operations and business logic for users
 */
export class UserService {
  /**
   * Find user by ID
   */
  static async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  /**
   * Find user by Email
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Create a new user
   */
  static async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Update user
   */
  static async update(
    id: string | Types.ObjectId,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Soft delete user
   */
  static async softDelete(id: string | Types.ObjectId, deletedBy: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
        status: UserStatus.Inactive, // Optional: mark status as inactive
      },
      { new: true }
    ).exec();
  }

  /**
   * List users with pagination and filtering
   */
  static async list(
    filter: QueryFilter<IUser> = {},
    page = 1,
    limit = 20,
    sort: Record<string, SortOrder> = { createdAt: -1 }
  ): Promise<{ users: IUser[]; total: number; pages: number }> {
    const query = { ...filter, isDeleted: false };
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).sort(sort).skip(skip).limit(limit).exec(),
      User.countDocuments(query),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Search users by text
   */
  static async search(query: string, limit = 20): Promise<IUser[]> {
    return User.search(query, limit);
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const count = await User.countDocuments({
      email: email.toLowerCase(),
      isDeleted: false,
    });
    return count > 0;
  }

  /**
   * Update User Status
   */
  static async updateStatus(
    id: string | Types.ObjectId,
    status: UserStatus,
    reason?: string,
    changedBy?: string | Types.ObjectId
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      {
        status,
        statusReason: reason,
        statusChangedAt: new Date(),
        statusChangedBy: changedBy,
      },
      { new: true }
    ).exec();
  }
}
