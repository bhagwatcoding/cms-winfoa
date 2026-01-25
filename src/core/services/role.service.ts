import { Types } from 'mongoose';
import { Role } from '@/core/db/models';
import { IRole } from '@/core/db/models/core/Role'; // Importing directly if not in core interfaces or update core interfaces
// Assuming IRole is in core interfaces? Step 756 says: export type { IRole } from './core/Role';
// I should import from @/core/db/models if index exports it.

/**
 * Service for Role management (RBAC)
 */
export class RoleService {
  /**
   * List all roles
   */
  static async list(): Promise<IRole[]> {
    return Role.find({ isDeleted: false }).sort({ priority: 1 }).exec();
  }

  /**
   * Find role by ID
   */
  static async findById(id: string | Types.ObjectId): Promise<IRole | null> {
    return Role.findById(id).exec();
  }

  /**
   * Find role by Slug
   */
  static async findBySlug(slug: string): Promise<IRole | null> {
    return Role.findOne({ slug, isDeleted: false }).exec();
  }

  /**
   * Create a new role
   */
  static async create(roleData: Partial<IRole>): Promise<IRole> {
    const role = new Role(roleData);
    return role.save();
  }

  /**
   * Update role
   */
  static async update(
    id: string | Types.ObjectId,
    updateData: Partial<IRole>
  ): Promise<IRole | null> {
    return Role.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  /**
   * Delete role (soft delete)
   */
  static async delete(id: string | Types.ObjectId): Promise<boolean> {
    const result = await Role.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    return !!result;
  }

  /**
   * Get permissions for a role
   */
  static async getPermissions(id: string | Types.ObjectId): Promise<string[]> {
    const role = await Role.findById(id).select('permissions').exec();
    return role?.permissions || [];
  }
}
