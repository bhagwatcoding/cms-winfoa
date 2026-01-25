import { SystemSetting } from '@/core/db/models';

/**
 * Service for System Settings
 */
export class SystemService {
  /**
   * Get a setting value
   */
  static async get(key: string, defaultValue: unknown = null): Promise<unknown> {
    const setting = await SystemSetting.findOne({ key });
    return setting ? setting.value : defaultValue;
  }

  /**
   * Set a setting value
   */
  static async set(
    key: string,
    value: unknown,
    category?: string,
    description?: string
  ): Promise<unknown> {
    return SystemSetting.findOneAndUpdate(
      { key },
      { value, category, description, updatedAt: new Date() },
      { upsert: true, new: true }
    ).exec();
  }

  /**
   * Get all settings
   */
  static async getAll(category?: string): Promise<unknown[]> {
    const query: Record<string, unknown> = {};
    if (category) query['category'] = category;
    return SystemSetting.find(query).exec();
  }
}
