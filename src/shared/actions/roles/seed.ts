/**
 * Seed Default Roles
 * Initialize system roles with predefined permissions
 */

'use server';

import connectDB from '@/lib/db';
import { Role } from '@/models/core/Role';
import {
    SUPER_ADMIN_PERMISSIONS,
    ADMIN_PERMISSIONS,
    STAFF_PERMISSIONS,
    CENTER_PERMISSIONS,
    STUDENT_PERMISSIONS,
    USER_PERMISSIONS,
} from '@/lib/permissions/constants';

export async function seedDefaultRoles() {
    try {
        await connectDB();

        const defaultRoles = [
            {
                name: 'Super Admin',
                slug: 'super-admin',
                description: 'Full system access with all permissions',
                permissions: SUPER_ADMIN_PERMISSIONS,
                isSystemRole: true,
                priority: 100,
            },
            {
                name: 'Administrator',
                slug: 'admin',
                description: 'User management and administrative operations',
                permissions: ADMIN_PERMISSIONS,
                isSystemRole: true,
                priority: 90,
            },
            {
                name: 'Staff',
                slug: 'staff',
                description: 'Student and course management access',
                permissions: STAFF_PERMISSIONS,
                isSystemRole: true,
                priority: 70,
            },
            {
                name: 'Center',
                slug: 'center',
                description: 'Center-specific operations and student management',
                permissions: CENTER_PERMISSIONS,
                isSystemRole: true,
                priority: 60,
            },
            {
                name: 'Student',
                slug: 'student',
                description: 'Student portal access',
                permissions: STUDENT_PERMISSIONS,
                isSystemRole: true,
                priority: 30,
            },
            {
                name: 'User',
                slug: 'user',
                description: 'Basic user access',
                permissions: USER_PERMISSIONS,
                isSystemRole: true,
                priority: 10,
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
            message: 'Default roles seeded successfully',
        };
    } catch (error: any) {
        console.error('Seed roles error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
}
