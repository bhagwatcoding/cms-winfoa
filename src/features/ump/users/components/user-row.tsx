'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUserAction, toggleUserStatusAction, updateUserRoleAction } from '@/actions/users';
import { PermissionGate } from '@/lib/permissions/components';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/lib/constants';
import type { IUser } from '@/types/models';

interface UserRowProps {
    user: IUser;
    currentUser: IUser;
}

export function UserRow({ user, currentUser }: UserRowProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
            return;
        }

        setLoading(true);
        const result = await deleteUserAction(user._id.toString());

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    const handleToggleStatus = async () => {
        setLoading(true);
        const result = await toggleUserStatusAction(user._id.toString());

        if (result.success) {
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    const isCurrentUser = user._id.toString() === currentUser._id.toString();

    return (
        <tr className="hover:bg-gray-50">
            {/* User */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                        )}
                    </div>
                </div>
            </td>

            {/* Email */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
                {user.emailVerified ? (
                    <div className="text-xs text-green-600">✓ Verified</div>
                ) : (
                    <div className="text-xs text-gray-500">Not verified</div>
                )}
            </td>

            {/* Role */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'staff' ? 'bg-green-100 text-green-800' :
                                user.role === 'center' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                    }`}>
                    {USER_ROLE_LABELS[user.role]}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}>
                    {USER_STATUS_LABELS[user.status]}
                </span>
            </td>

            {/* Joined */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(user.joinedAt)}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative inline-block">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="text-gray-400 hover:text-gray-500 p-2"
                        disabled={loading}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>

                    {showActions && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowActions(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                <div className="py-1">
                                    <a
                                        href={`/ump/users/${user._id}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        View Details
                                    </a>

                                    <PermissionGate user={currentUser} permission="users:update">
                                        <button
                                            onClick={handleToggleStatus}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            disabled={isCurrentUser}
                                        >
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </PermissionGate>

                                    <PermissionGate user={currentUser} permission="users:delete">
                                        <button
                                            onClick={handleDelete}
                                            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                            disabled={isCurrentUser}
                                        >
                                            Delete User
                                        </button>
                                    </PermissionGate>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
