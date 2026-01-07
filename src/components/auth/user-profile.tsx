'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { UserIcon } from 'lucide-react';

export function UserProfile() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                ) : (
                    <UserIcon className="w-5 h-5" />
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
            </div>
        </div>
    );
}
