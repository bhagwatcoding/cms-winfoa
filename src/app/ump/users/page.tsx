import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { UserList } from '@/features/ump/users/components/user-list';
import { UserListSkeleton } from '@/features/ump/users/components/user-list-skeleton';
import { UserHeader } from '@/features/ump/users/components/user-header';
import { requirePermission } from '@/lib/permissions';

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string; role?: string; status?: string };
}) {
    // Get current user and check permissions
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect('/login');
    }

    // Check if user has permission to view users
    try {
        requirePermission(currentUser, 'users:view');
    } catch (e) {
        console.log(e)
        redirect('/ump');
    }

    const page = parseInt(searchParams.page || '1');
    const search = searchParams.search || '';
    const role = searchParams.role || '';
    const status = searchParams.status || '';

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header with Create Button */}
            <UserHeader currentUser={currentUser} />

            {/* User List with Suspense */}
            <Suspense
                key={`${page}-${search}-${role}-${status}`}
                fallback={<UserListSkeleton />}
            >
                <UserList
                    currentUser={currentUser}
                    page={page}
                    search={search}
                    role={role}
                    status={status}
                />
            </Suspense>
        </div>
    );
}
