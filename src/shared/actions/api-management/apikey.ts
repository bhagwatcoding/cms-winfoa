'use server';

import { revalidatePath } from 'next/cache';
import { ApiKeyService } from '@/services/api-management';
import { SessionService } from '@/services/auth/session.service';
import { getErrorMessage } from '@/lib/utils';
import { createApiKeySchema } from '@/core/utils/schemas/api-key';
import { validateSchema } from '@/core/utils/validations/utils';

export async function createApiKey(prevState: unknown, formData: FormData) {
  try {
    const session = await SessionService.getCurrentSession();

    if (!session) {
      return { error: 'Not authenticated' };
    }

    const rawData = {
      name: formData.get('name'),
      permissions: formData.get('permissions')
        ? JSON.parse(formData.get('permissions') as string)
        : ['read'],
      rateLimit: formData.get('rateLimit') ? parseInt(formData.get('rateLimit') as string) : 1000,
    };

    const validation = validateSchema(createApiKeySchema, rawData);
    if (!validation.success) {
      return { error: validation.errors?.[0]?.message || 'Invalid input' };
    }

    const apiKey = await ApiKeyService.createApiKey(
      session.userId._id.toString(),
      validation.data!
    );

    revalidatePath('/god/api-keys');

    return {
      success: true,
      data: apiKey,
      message: "API key created successfully. Save this key - you won't see it again!",
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getApiKeys() {
  try {
    const session = await SessionService.getCurrentSession();

    if (!session) {
      return { error: 'Not authenticated' };
    }

    const keys = await ApiKeyService.getUserApiKeys(session.userId._id.toString());

    return { success: true, data: keys };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function revokeApiKey(keyId: string) {
  try {
    const session = await SessionService.getCurrentSession();

    if (!session) {
      return { error: 'Not authenticated' };
    }

    await ApiKeyService.revokeApiKey(keyId, session.userId._id.toString());

    revalidatePath('/api/keys');

    return { success: true, message: 'API key revoked successfully' };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteApiKey(keyId: string) {
  try {
    const session = await SessionService.getCurrentSession();

    if (!session) {
      return { error: 'Not authenticated' };
    }

    await ApiKeyService.deleteApiKey(keyId, session.userId._id.toString());

    revalidatePath('/god/api-keys');

    return { success: true, message: 'API key deleted successfully' };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getApiKeyStats(keyId: string) {
  try {
    const session = await SessionService.getCurrentSession();

    if (!session) {
      return { error: 'Not authenticated' };
    }

    const stats = await ApiKeyService.getApiKeyStats(keyId, session.userId._id.toString());

    return { success: true, data: stats };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
