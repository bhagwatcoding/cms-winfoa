import { User, ActivityLog } from '@/models';
import { ActionType, ResourceType } from '@/core/db/enums';
import { connectDB } from '@/lib/db';

export class ProfileService {
  /**
   * Get user profile
   */
  static async getProfile(userId: string) {
    await connectDB();

    const user = await User.findById(userId)
      .select('-password')
      .populate('roleId', 'name slug')
      .lean();

    if (!user) {
      throw new Error('User not found');
    }

    // Transform for UI
    return {
      ...user,
      id: user._id.toString(),
      name: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
      role: (user.roleId as unknown as { slug: string })?.slug || 'user',
      joinedAt: user.createdAt,
    };
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      avatar?: string;
      name?: string;
    }
  ) {
    await connectDB();

    // Update name if firstName/lastName changed
    if (data.firstName || data.lastName) {
      const user = await User.findById(userId);
      if (user) {
        const firstName = data.firstName || user.firstName || '';
        const lastName = data.lastName || user.lastName || '';
        data.name = `${firstName} ${lastName}`.trim();
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    // Log activity
    await ActivityLog.create({
      actorId: userId,
      action: ActionType.Update,
      resource: ResourceType.User,
      details: `Updated profile fields: ${Object.keys(data).join(', ')}`,
      metadata: { fields: Object.keys(data) },
    });

    return user;
  }

  /**
   * Change email
   */
  static async changeEmail(userId: string, newEmail: string) {
    await connectDB();

    // Check if email is already taken
    const existing = await User.findOne({
      email: newEmail.toLowerCase().trim(),
      _id: { $ne: userId },
    });

    if (existing) throw new Error('This email is already in use');

    // Update email and mark as unverified
    const user = await User.findByIdAndUpdate(
      userId,
      {
        email: newEmail.toLowerCase().trim(),
        emailVerified: false,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    // Log activity
    await ActivityLog.create({
      actorId: userId,
      action: ActionType.Update,
      resource: ResourceType.User,
      details: `Email changed to ${newEmail}`,
      metadata: { newEmail },
    });

    // TODO: Send verification email to new address

    return user;
  }

  /**
   * Upload avatar
   */
  static async uploadAvatar(userId: string, avatarUrl: string) {
    await connectDB();

    const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select(
      '-password'
    );

    if (!user) {
      throw new Error('User not found');
    }

    await ActivityLog.create({
      actorId: userId,
      action: ActionType.Update,
      resource: ResourceType.User,
      details: 'Avatar updated',
      metadata: { avatarUrl },
    });

    return user;
  }

  /**
   * Delete account (soft delete)
   */
  static async deleteAccount(userId: string) {
    await connectDB();

    // Log before deletion
    await ActivityLog.create({
      actorId: userId,
      action: ActionType.SoftDelete,
      resource: ResourceType.User,
      details: 'Account deactivated',
      metadata: { deletedAt: new Date() },
    });

    // Soft delete
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      status: 'inactive',
    });

    // Or hard delete (uncomment if needed):
    // await User.findByIdAndDelete(userId)
    // await ActivityLog.deleteMany({ userId })
    // await UserPreferences.findOneAndDelete({ userId })

    return { success: true, message: 'Account deactivated' };
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string) {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get activity count
    const activityCount = await ActivityLog.countDocuments({ actorId: userId });

    // Get recent activities
    const recentActivities = await ActivityLog.find({ actorId: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      memberSince: user.createdAt,
      lastLogin: user.lastLoginAt,
      totalActivities: activityCount,
      recentActivities,
      emailVerified: user.emailVerified,
      oauthConnected: user.linkedAccounts && user.linkedAccounts.length > 0,
    };
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(userId: string, limit: number = 20) {
    await connectDB();

    const activities = await ActivityLog.find({ actorId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return activities.map((activity) => ({
      id: activity._id.toString(),
      action: activity.action,
      resource: activity.resource,
      details: activity.details,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    }));
  }
}
