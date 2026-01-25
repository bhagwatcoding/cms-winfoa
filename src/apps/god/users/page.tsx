'use client';

import { Button } from '@/ui';
import { DataTable } from '@/features/god';
import { Users, UserPlus } from 'lucide-react';
import { columns } from '@/features/god/users/UserColumn';
import { mockUsers } from '@/features/god/users/mockUser';

export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Users className="h-6 w-6 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage all user accounts, roles, and permissions</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">12,847</p>
        </div>
        <div className="rounded-lg border bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-emerald-500">11,923</p>
        </div>
        <div className="rounded-lg border bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-bold text-rose-500">842</p>
        </div>
        <div className="rounded-lg border bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">On Leave</p>
          <p className="text-2xl font-bold text-amber-500">82</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={mockUsers}
        columns={columns}
        title="All Users"
        description="Click on a user to view details"
        searchPlaceholder="Search users..."
        pageSize={10}
      />
    </div>
  );
}
