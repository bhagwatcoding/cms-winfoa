import { ApiKey, WebhookSubscription } from '@/core/db/models';
import { WebhookEvent, ApiKeyScope } from '@/core/db/enums';
import { Types } from 'mongoose';

/**
 * Service for API Management (Keys, Webhooks)
 */
export class ApiService {
  /**
   * Create API Key (delegates to Model)
   */
  static async createKey(data: {
    userId: string | Types.ObjectId;
    name: string;
    scopes?: ApiKeyScope[];
  }): Promise<{ key: string; record: unknown }> {
    return ApiKey.generate({
      userId: new Types.ObjectId(data.userId),
      name: data.name,
      scopes: data.scopes,
    });
  }

  /**
   * Validate API Key
   */
  static async validateKey(rawKey: string): Promise<unknown | null> {
    const result = await ApiKey.validateKey(rawKey);
    return result.valid ? result.apiKey : null;
  }

  /**
   * Register Webhook
   */
  static async registerWebhook(data: {
    userId: string | Types.ObjectId;
    url: string;
    events: WebhookEvent[];
    secret?: string;
  }): Promise<unknown> {
    return WebhookSubscription.create({
      ...data,
      isActive: true,
      createdAt: new Date(),
    });
  }
}
