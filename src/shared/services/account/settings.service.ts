import bcrypt from 'bcryptjs';
import { User, UserPreferences, ActivityLog } from '@/models';
import { connectDB } from '@/lib/db';
import { ActionType, ResourceType } from '@/types';

export class SettingsService {
  /**
   * Get user preferences
   */
  static async getPreferences(userId: string) {
    await connectDB();

    let prefs = await UserPreferences.findOne({ userId });

    // Create default if doesn't exist
    if (!prefs) {
      prefs = await UserPreferences.create({ userId });
    }

    return prefs;
  }

  /**
   * Update preferences
   */
  static async updatePreferences(userId: string, data: Record<string, unknown>) {
    await connectDB();

    const prefs = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );

    await ActivityLog.create({
      actorId: userId,
      action: ActionType.Update,
      resource: ResourceType.User,
      details: JSON.stringify({ updated: Object.keys(data) }),
    });

    return prefs;
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    await connectDB();

    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    // Skip password check for OAuth users
    if (!user.oauthProvider && user.password) {
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    user.oauthProvider = undefined; // Remove OAuth if setting password
    await user.save();

    // Log activity
    await ActivityLog.create({
      actorId: userId,
      action: ActionType.Update,
      resource: ResourceType.User,
      details: JSON.stringify({ action: 'password_change', timestamp: new Date() }),
    });

    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Update email notifications
   */
  static async updateEmailNotifications(
    userId: string,
    settings: {
      marketing?: boolean;
      updates?: boolean;
      security?: boolean;
      newsletter?: boolean;
    }
  ) {
    return this.updatePreferences(userId, {
      emailNotifications: settings,
    });
  }

  /**
   * Update push notifications
   */
  static async updatePushNotifications(
    userId: string,
    settings: {
      enabled?: boolean;
      browser?: boolean;
      mobile?: boolean;
    }
  ) {
    return this.updatePreferences(userId, {
      pushNotifications: settings,
    });
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(
    userId: string,
    settings: {
      profileVisibility?: 'public' | 'private' | 'friends';
      showEmail?: boolean;
      showActivity?: boolean;
    }
  ) {
    return this.updatePreferences(userId, {
      privacy: settings,
    });
  }

  /**
   * Update theme
   */
  static async updateTheme(userId: string, theme: 'light' | 'dark' | 'system') {
    return this.updatePreferences(userId, { theme });
  }

  /**
   * Update language
   */
  static async updateLanguage(userId: string, language: string) {
    return this.updatePreferences(userId, { language });
  }

  /**
   * Update timezone
   */
  static async updateTimezone(userId: string, timezone: string) {
    return this.updatePreferences(userId, { timezone });
  }
}
