'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  MoreVertical,
  UserPlus,
  CheckCircle2,
  XCircle,
  Shield,
  Key,
  RefreshCw,
  Trash2,
  Eye,
  LogOut,
  Power,
} from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  useToast,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui';
import { getUsersAction, deleteUserAction } from '@/actions';
import {
  activateUserAction,
  deactivateUserAction,
  getUserSessionsAction,
  invalidateAllUserSessionsAction,
  changeUserRoleAction,
  updateUserPermissionsAction,
} from '@/actions';
import type { IUser } from '@/core/db/models';
import { UserStatus } from '@/core/db/enums';
import {
  PERMISSION_GROUPS,
  UserRole,
  getPermissionLabel,
  type Permission,
} from '@/core/permissions';

interface UserSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export function UsersManagement() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [dialogType, setDialogType] = useState<
    'sessions' | 'permissions' | 'role' | 'delete' | null
  >(null);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await getUsersAction({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: roleFilter !== 'all' ? (roleFilter as any) : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });

      if (result.success) {
        setUsers(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to fetch users',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, roleFilter, statusFilter]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchUsers();
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Handle user activation
  const handleActivate = async (user: IUser) => {
    startTransition(async () => {
      const result = await activateUserAction(user._id.toString());
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  // Handle user deactivation
  const handleDeactivate = async (user: IUser) => {
    startTransition(async () => {
      const result = await deactivateUserAction(user._id.toString());
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  // Handle view sessions
  const handleViewSessions = async (user: IUser) => {
    setSelectedUser(user);
    setDialogType('sessions');

    const result = await getUserSessionsAction(user._id.toString());
    if (result.success && result.data) {
      setUserSessions(result.data);
    } else {
      setUserSessions([]);
      if (!result.success) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }
  };

  // Handle invalidate all sessions
  const handleInvalidateSessions = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const result = await invalidateAllUserSessionsAction(selectedUser._id.toString());
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDialogType(null);
        setUserSessions([]);
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  // Handle open permissions dialog
  const handleOpenPermissions = (user: IUser) => {
    setSelectedUser(user);
    setSelectedPermissions(user.customPermissions || []);
    setDialogType('permissions');
  };

  // Handle save permissions
  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const result = await updateUserPermissionsAction(
        selectedUser._id.toString(),
        selectedPermissions
      );
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDialogType(null);
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  // Handle open role dialog
  const handleOpenRoleDialog = (user: IUser) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setDialogType('role');
  };

  // Handle change role
  const handleChangeRole = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const result = await changeUserRoleAction(selectedUser._id.toString(), selectedRole);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDialogType(null);
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      const result = await deleteUserAction(selectedUser._id.toString());
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        setDialogType(null);
        fetchUsers();
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'super-admin': 'bg-purple-100 text-purple-800 border-purple-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      staff: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      center: 'bg-green-100 text-green-800 border-green-200',
      student: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[role] || colors.user;
  };

  const getStatusBadge = (user: IUser) => {
    if (user.isActive && user.status === UserStatus.Active) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8" />
            User Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all users across all subdomains</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({pagination.total})</span>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Login</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center">
                        <RefreshCw className="w-6 h-6 mx-auto animate-spin text-gray-400" />
                        <p className="mt-2 text-gray-500">Loading users...</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <motion.tr
                        key={user._id.toString()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-gray-500 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(user)}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {user.lastLoginAt
                            ? new Date(user.lastLoginAt).toLocaleDateString()
                            : 'Never'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewSessions(user)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Sessions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenPermissions(user)}>
                                  <Key className="w-4 h-4 mr-2" />
                                  Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenRoleDialog(user)}>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.isActive ? (
                                  <DropdownMenuItem
                                    onClick={() => handleDeactivate(user)}
                                    className="text-red-600"
                                  >
                                    <Power className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleActivate(user)}
                                    className="text-green-600"
                                  >
                                    <Power className="w-4 h-4 mr-2" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setDialogType('delete');
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions Dialog */}
      <Dialog open={dialogType === 'sessions'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Active Sessions - {selectedUser?.name}</DialogTitle>
            <DialogDescription>View and manage active sessions for this user</DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto space-y-3">
            {userSessions.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No active sessions</p>
            ) : (
              userSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-gray-500">{session.userAgent || 'Unknown device'}</p>
                    <p className="text-xs text-gray-400">IP: {session.ipAddress || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">
                      Expires: {new Date(session.expiresAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleInvalidateSessions}
              disabled={isPending || userSessions.length === 0}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Invalidate All Sessions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={dialogType === 'permissions'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissions - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Grant additional permissions beyond the role&apos;s default permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
              <div key={group}>
                <h4 className="font-semibold text-sm mb-2">{group}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, permission]);
                          } else {
                            setSelectedPermissions(
                              selectedPermissions.filter((p) => p !== permission)
                            );
                          }
                        }}
                        className="rounded"
                      />
                      {getPermissionLabel(permission as Permission)}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePermissions} disabled={isPending}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={dialogType === 'role'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Select a new role for this user. This will affect their permissions.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as UserRole)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super-admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole} disabled={isPending}>
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isPending}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
