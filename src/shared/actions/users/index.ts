/**
 * User Management Actions
 * Server actions for user CRUD operations with role management
 */

'use server';

import { connectDB } from '@/lib/db';
import { requirePermission } from '@/lib/permissions';
import { getCurrentUser } from '@/lib/session';
import { createUserSchema, updateUserSchema } from '@/core/utils/schemas/user';
import { validateSchema } from '@/core/utils/validations/utils';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';
import { getErrorMessage } from '@/lib/utils';
import { UserService } from '@/shared/services/user.service';
import type {
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  PaginatedResponse,
} from '@/shared/types/api';
import { UserRole, UserStatus, type IUser } from '@/core/db/interfaces';

// ==========================================
// CREATE USER
// ==========================================

export async function createUserAction(data: unknown): Promise<CreateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:create');

    // Validate input
    const validation = validateSchema(createUserSchema, data);

    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        errors: validation.errors,
      };
    }

    const userData = validation.data!;

    await connectDB();

    const user = await UserService.createUser(userData as Partial<IUser>);
    const userObject = user as unknown as IUser; // Type assertion since it returns a plain object

    // Remove password if present (though UserService might not include it)
    if ('password' in userObject) {
      delete userObject.password;
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_CREATED,
      data: userObject,
    };
  } catch (error) {
    console.error('Create user error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// UPDATE USER
// ==========================================

export async function updateUserAction(
  userId: string,
  data: unknown
): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:update');

    // Validate input
    const validation = validateSchema(updateUserSchema, data);

    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.[0]?.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        errors: validation.errors,
      };
    }

    await connectDB();

    const user = await UserService.updateUser(userId, validation.data as Partial<IUser>);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    const userObject = user as unknown as IUser;
    if ('password' in userObject) {
      delete userObject.password;
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_UPDATED,
      data: userObject,
    };
  } catch (error) {
    console.error('Update user error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// DELETE USER
// ==========================================

export async function deleteUserAction(userId: string): Promise<DeleteResponse> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:delete');

    // Prevent deleting own account
    if (userId === currentUser?.id) {
      return {
        success: false,
        error: 'Cannot delete your own account',
      };
    }

    await connectDB();

    // Check if user exists first? UserService.deleteUser could handle it but for returning specific error "User not found" maybe.
    // UserService.deleteUser uses findByIdAndDelete which returns null if not found.

    const deleted = await UserService.deleteUser(currentUser?.id || 'unknown', userId);
    if (!deleted) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGES.USER_DELETED,
      deletedCount: 1,
    };
  } catch (error) {
    console.error('Delete user error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// GET USER
// ==========================================

export async function getUserAction(userId: string): Promise<CreateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:view');

    await connectDB();

    const user = await UserService.getUserById(userId);

    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    const userObject = user as unknown as IUser;
    if ('password' in userObject) {
      delete userObject.password;
    }

    return {
      success: true,
      data: userObject,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// GET USERS (PAGINATED)
// ==========================================

export async function getUsersAction(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: string;
}): Promise<PaginatedResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:view');

    await connectDB();

    const result = await UserService.getUsers({
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || '',
      role: params?.role?.toString() || UserRole.User.toString(),
    });

    return {
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.pages,
        hasNextPage: result.page < result.pages,
        hasPreviousPage: result.page > 1,
      },
    };
  } catch (error) {
    console.error('Get users error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

// ==========================================
// UPDATE USER ROLE
// ==========================================

export async function updateUserRoleAction(
  userId: string,
  role: UserRole
): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission (only super-admin can change roles)
    requirePermission(currentUser, 'system:manage');

    // Prevent changing own role
    if (userId === currentUser?.id) {
      return {
        success: false,
        error: 'Cannot change your own role',
      };
    }

    await connectDB();

    const user = await UserService.changeRole(userId, role.toString());
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    const userObject = user as unknown as IUser;
    if ('password' in userObject) {
      delete userObject.password;
    }

    return {
      success: true,
      message: 'User role updated successfully',
      data: userObject,
    };
  } catch (error) {
    console.error('Update role error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}

// ==========================================
// TOGGLE USER STATUS
// ==========================================

export async function toggleUserStatusAction(userId: string): Promise<UpdateResponse<IUser>> {
  try {
    const currentUser = await getCurrentUser();

    // Check permission
    requirePermission(currentUser, 'users:update');

    await connectDB();

    const user = await UserService.toggleStatus(userId);
    if (!user) {
      return {
        success: false,
        error: ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }

    const userObject = user as unknown as IUser;
    if ('password' in userObject) {
      delete userObject.password;
    }

    return {
      success: true,
      message: `User ${user.status === UserStatus.Active ? 'activated' : 'deactivated'} successfully`,
      data: userObject,
    };
  } catch (error) {
    console.error('Toggle status error:', error);
    return {
      success: false,
      error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
    };
  }
}
