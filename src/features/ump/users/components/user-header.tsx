'use client';

import { useState } from 'react';
import { PermissionGate } from '@/lib/permissions/components';
import { CreateUserDialog } from './create-user-dialog';
import type { IUser } from '@/types/models';

export function UserHeader({ currentUser }: { currentUser: IUser }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>

        {/* Create User Button - Only if has permission */}
        <PermissionGate user={currentUser} permission="users:create">
          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create User
          </button>
        </PermissionGate>
      </div>

      {/* Create User Dialog */}
      {showCreateDialog && <CreateUserDialog onClose={() => setShowCreateDialog(false)} />}
    </>
  );
}
