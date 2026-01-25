'use server';

import { UserIdService } from '@/services/admin/userid.service';
import { SessionService } from '@/services/auth/session.service';
import { getErrorMessage } from '@/lib/utils';
import { validateSchema } from '@/core/utils/validations/utils';
import { registerUserSchema } from '@/core/utils/validations/admin.validation';

export async function registerUserInUMP(data: { email: string; role: string; metadata?: unknown }) {
  try {
    const session = await SessionService.getCurrentSession();

    const validation = validateSchema(registerUserSchema, data);
    if (!validation.success) {
      return { error: validation.errors?.[0]?.message || 'Invalid input' };
    }

    const { email, role, metadata } = validation.data!;

    const result = await UserIdService.registerUser({
      email,
      role,
      createdBy: session?.userId?._id?.toString(),
      metadata,
    });

    return { success: true, data: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function activateUserInUMP(userId: string) {
  try {
    const result = await UserIdService.activateUser(userId);
    return { success: true, data: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getAllUsersFromUMP(options?: {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
}) {
  try {
    const result = await UserIdService.getAllUsers(options);
    return { success: true, ...result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getUserStats() {
  try {
    const stats = await UserIdService.getStatistics();
    return { success: true, data: stats };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
