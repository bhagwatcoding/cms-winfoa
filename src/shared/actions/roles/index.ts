/**
 * Role Management Actions
 * CRUD operations for dynamic role management
 */

'use server';

import { connectDB } from '@/lib/db';
import { Role, User } from '@/models';
import type { IRole } from '@/models';
import { getCurrentUser } from '@/core/session';
import { requirePermission } from '@/lib/permissions';
import { ERROR_MESSAGES } from '@/lib/constants';
import type { CreateResponse, UpdateResponse, DeleteResponse, FetchManyResponse } from '@/types/api';
import { getErrorMessage } from '@/lib/utils';

// ==========================================
// CREATE ROLE
// ==========================================

export async function createRoleAction(data: {
    name: string;
    slug: string;
    description?: string;
    permissions: string[];
    priority?: number;
}): Promise<CreateResponse<IRole>> {
    try {
        const currentUser = await getCurrentUser();

        // Only god can manage roles
        requirePermission(currentUser, 'system:manage');

        await connectDB();

        // Check if slug already exists
        const existing = await Role.findOne({ slug: data.slug });
        if (existing) {
            return {
                success: false,
                error: 'Role slug already exists'
            };
        }

        // Create role
        const role = await Role.create({
            name: data.name,
            slug: data.slug,
            description: data.description,
            permissions: data.permissions,
            isSystem: false, // Custom roles are not system roles
            isActive: true,
            priority: data.priority || 0,
        });

        return {
            success: true,
            message: 'Role created successfully',
            data: role.toObject() as IRole,
        };
    } catch (error) {
        console.error('Create role error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// UPDATE ROLE
// ==========================================

export async function updateRoleAction(
    roleId: string,
    data: {
        name?: string;
        description?: string;
        permissions?: string[];
        priority?: number;
        isActive?: boolean;
    }
): Promise<UpdateResponse<IRole>> {
    try {
        const currentUser = await getCurrentUser();

        // Only god can manage roles
        requirePermission(currentUser, 'system:manage');

        await connectDB();

        const role = await Role.findById(roleId);
        if (!role) {
            return {
                success: false,
                error: 'Role not found'
            };
        }

        // Prevent modifying system roles' permissions
        if (role.isSystem && data.permissions) {
            return {
                success: false,
                error: 'Cannot modify permissions of system roles'
            };
        }

        // Update role
        if (data.name) role.name = data.name;
        if (data.description !== undefined) role.description = data.description;
        if (data.permissions) role.permissions = data.permissions;
        if (data.priority !== undefined) role.priority = data.priority;
        if (data.isActive !== undefined) role.isActive = data.isActive;

        await role.save();

        return {
            success: true,
            message: 'Role updated successfully',
            data: role.toObject() as IRole,
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
// DELETE ROLE
// ==========================================

export async function deleteRoleAction(roleId: string): Promise<DeleteResponse> {
    try {
        const currentUser = await getCurrentUser();

        // Only god can manage roles
        requirePermission(currentUser, 'system:manage');

        await connectDB();

        const role = await Role.findById(roleId);
        if (!role) {
            return {
                success: false,
                error: 'Role not found'
            };
        }

        // Prevent deleting system roles
        if (role.isSystem) {
            return {
                success: false,
                error: 'Cannot delete system roles'
            };
        }

        // Check if any users have this role
        const usersWithRole = await User.countDocuments({ roleId: role._id });
        if (usersWithRole > 0) {
            return {
                success: false,
                error: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.`
            };
        }

        await Role.findByIdAndDelete(roleId);

        return {
            success: true,
            message: 'Role deleted successfully',
            deletedCount: 1,
        };
    } catch (error) {
        console.error('Delete role error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// GET ROLE
// ==========================================

export async function getRoleAction(roleId: string): Promise<CreateResponse<IRole>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:view');

        await connectDB();

        const role = await Role.findById(roleId).lean();

        if (!role) {
            return {
                success: false,
                error: 'Role not found'
            };
        }

        return {
            success: true,
            data: role as IRole,
        };
    } catch (error) {
        console.error('Get role error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// GET ALL ROLES
// ==========================================

export async function getRolesAction(params?: {
    includeInactive?: boolean;
}): Promise<FetchManyResponse<IRole>> {
    try {
        const currentUser = await getCurrentUser();

        // Check permission
        requirePermission(currentUser, 'users:view');

        await connectDB();

        const query: Record<string, unknown> = {};

        if (!params?.includeInactive) {
            query.isActive = true;
        }

        const roles = await Role.find(query)
            .sort({ priority: -1, name: 1 })
            .lean();

        return {
            success: true,
            data: roles as IRole[],
            total: roles.length,
        };
    } catch (error) {
        console.error('Get roles error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
            data: [],
            total: 0,
        };
    }
}

// ==========================================
// GET ROLE BY SLUG
// ==========================================

export async function getRoleBySlugAction(slug: string): Promise<CreateResponse<IRole>> {
    try {
        await connectDB();

        const role = await Role.findOne({ slug, isActive: true }).lean();

        if (!role) {
            return {
                success: false,
                error: 'Role not found'
            };
        }

        return {
            success: true,
            data: role as IRole,
        };
    } catch (error) {
        console.error('Get role by slug error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}

// ==========================================
// ASSIGN ROLE TO USER
// ==========================================

export async function assignRoleToUserAction(
    userId: string,
    roleId: string
): Promise<UpdateResponse<unknown>> {
    try {
        const currentUser = await getCurrentUser();

        // Only god can assign roles
        requirePermission(currentUser, 'system:manage');

        await connectDB();

        const [role, user] = await Promise.all([
            Role.findById(roleId),
            User.findById(userId),
        ]);

        if (!role) {
            return {
                success: false,
                error: 'Role not found'
            };
        }

        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.USER_NOT_FOUND
            };
        }

        // Update user's role
        user.roleId = role._id;
        user.role = role.slug as 'god' | 'admin' | 'staff' | 'user'; // Sync string role for backward compatibility
        await user.save();

        return {
            success: true,
            message: `Role "${role.name}" assigned to ${user.name}`,
            data: user.toObject(),
        };
    } catch (error) {
        console.error('Assign role error:', error);
        return {
            success: false,
            error: getErrorMessage(error) || ERROR_MESSAGES.SOMETHING_WENT_WRONG,
        };
    }
}
