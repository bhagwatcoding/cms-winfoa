import { getUsersAction } from '@/actions/users';
import { UserTable } from './user-table';
import { UserFilters } from './user-filters';
import { UserPagination } from './user-pagination';
import type { IUser } from '@/types/models';

interface UserListProps {
    currentUser: IUser;
    page: number;
    search: string;
    role: string;
    status: string;
}

export async function UserList({ currentUser, page, search, role, status }: UserListProps) {
    // Fetch users from server
    const result = await getUsersAction({
        page,
        limit: 10,
        search: search || undefined,
        role: (role as string) || undefined,
        status: status || undefined,
    });

    if (!result.success) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-12">
                    <p className="text-red-600">{result.error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <UserFilters />

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {result.data.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No users found</p>
                    </div>
                ) : (
                    <UserTable users={result.data} currentUser={currentUser} />
                )}
            </div>

            {/* Pagination */}
            {result.pagination && result.pagination.totalPages > 1 && (
                <UserPagination pagination={result.pagination} />
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{result.data.length}</span> of{' '}
                    <span className="font-semibold">{result.pagination?.total || 0}</span> users
                </p>
            </div>
        </div>
    );
}
