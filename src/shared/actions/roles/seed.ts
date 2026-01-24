/**
 * Seed Default Roles
 * Initialize system roles with predefined permissions
 */

'use server';

import { connectDB } from '@/lib/db';
import Role from '@/models/core/Role';
import { GOD_PERMISSIONS } from '@/lib/permissions/constants';
import { getErrorMessage } from '@/lib/utils';

export async function seedDefaultRoles() {
    try {
        await connectDB();

        // 1. Define ONLY the God Role
        // All other roles (Admin, Staff, Student) must be created dynamically via the God Portal
        const defaultRoles = [
            {
                name: 'God',
                slug: 'god',
                description: 'Full system access with all permissions',
                permissions: GOD_PERMISSIONS,
                isSystem: true,
                priority: 100,
            },
        ];

        for (const roleData of defaultRoles) {
            const existing = await Role.findOne({ slug: roleData.slug });

            if (!existing) {
                await Role.create(roleData);
                console.log(`✓ Created role: ${roleData.name}`);
            } else {
                // Update system roles with latest permissions
                existing.name = roleData.name;
                existing.description = roleData.description;
                existing.permissions = roleData.permissions;
                existing.priority = roleData.priority;
                await existing.save();
                console.log(`✓ Updated role: ${roleData.name}`);
            }
        }

        return {
            success: true,
            message: 'Default roles seeded successfully (God only)',
        };
    } catch (error) {
        console.error('Seed roles error:', error);
        return {
            success: false,
            error: getErrorMessage(error),
        };
    }
}
