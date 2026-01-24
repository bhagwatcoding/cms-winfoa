/**
 * Permission-Based React Components
 * Easy-to-use components for conditional rendering
 */

'use client';

import { type ReactNode } from 'react';
import type { Permission } from './constants';
import { userHasPermission, userHasAnyPermission, userHasAllPermissions } from './checker';
import type { UserContext } from './checker';
import type { IUser } from '@/core/db/models/core/User';

// ==========================================
// TYPES
// ==========================================

interface PermissionGateProps {
    user: UserContext | null;
    permission: Permission;
    children: ReactNode;
    fallback?: ReactNode;
}

interface AnyPermissionGateProps {
    user: UserContext | null;
    permissions: Permission[];
    children: ReactNode;
    fallback?: ReactNode;
}

interface AllPermissionsGateProps {
    user: UserContext | null;
    permissions: Permission[];
    children: ReactNode;
    fallback?: ReactNode;
}

// ==========================================
// PERMISSION GATE COMPONENTS
// ==========================================

/**
 * Render children only if user has specific permission
 * 
 * @example
 * <PermissionGate user={user} permission="users:create">
 *   <CreateUserButton />
 * </PermissionGate>
 */
export function PermissionGate({
    user,
    permission,
    children,
    fallback = null,
}: PermissionGateProps) {
    if (!user || !userHasPermission(user, permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Render children if user has ANY of the permissions
 * 
 * @example
 * <AnyPermissionGate user={user} permissions={['users:view', 'users:manage']}>
 *   <UserList />
 * </AnyPermissionGate>
 */
export function AnyPermissionGate({
    user,
    permissions,
    children,
    fallback = null,
}: AnyPermissionGateProps) {
    if (!user || !userHasAnyPermission(user, permissions)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

/**
 * Render children if user has ALL permissions
 * 
 * @example
 * <AllPermissionsGate user={user} permissions={['users:view', 'users:delete']}>
 *   <DeleteUserButton />
 * </AllPermissionsGate>
 */
export function AllPermissionsGate({
    user,
    permissions,
    children,
    fallback = null,
}: AllPermissionsGateProps) {
    if (!user || !userHasAllPermissions(user, permissions)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

// ==========================================
// HOC (Higher-Order Component)
// ==========================================

/**
 * Wrap component with permission check
 * 
 * @example
 * const ProtectedComponent = withPermission(MyComponent, 'users:create');
 */
export function withPermission<P extends { user: IUser | null }>(
    Component: React.ComponentType<P>,
    permission: Permission
) {
    return function PermissionWrappedComponent(props: P) {
        if (!props.user || !userHasPermission(props.user, permission)) {
            return null;
        }

        return <Component {...props} />;
    };
}

/**
 * Wrap component with any permission check
 */
export function withAnyPermission<P extends { user: IUser | null }>(
    Component: React.ComponentType<P>,
    permissions: Permission[]
) {
    return function AnyPermissionWrappedComponent(props: P) {
        if (!props.user || !userHasAnyPermission(props.user, permissions)) {
            return null;
        }

        return <Component {...props} />;
    };
}

// ==========================================
// CUSTOM HOOKS
// ==========================================

/**
 * Helper to check permission
 */
export function hasPermission(user: IUser | null, permission: Permission): boolean {
    if (!user) return false;
    return userHasPermission(user, permission);
}

/**
 * Helper to check any permission
 */
export function hasAnyPermission(user: IUser | null, permissions: Permission[]): boolean {
    if (!user) return false;
    return userHasAnyPermission(user, permissions);
}

/**
 * Helper to check all permissions
 */
export function hasAllPermissions(user: IUser | null, permissions: Permission[]): boolean {
    if (!user) return false;
    return userHasAllPermissions(user, permissions);
}

/**
 * Helper to get multiple permission states
 */
export function getPermissionsMap<T extends Record<string, Permission>>(
    user: IUser | null,
    permissionsMap: T
): Record<keyof T, boolean> {
    const result = {} as Record<keyof T, boolean>;

    Object.entries(permissionsMap).forEach(([key, permission]) => {
        result[key as keyof T] = hasPermission(user, permission);
    });

    return result;
}

// Aliases for backward compatibility if needed, but renamed to avoid lint issues in loops
export { hasPermission as usePermission };
export { hasAnyPermission as useAnyPermission };
export { hasAllPermissions as useAllPermissions };
export { getPermissionsMap as usePermissions };
