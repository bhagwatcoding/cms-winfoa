'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/lib/constants';

export function UserFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset to page 1 when filtering
        params.set('page', '1');

        router.push(`/ump/users?${params.toString()}`);
    };

    const handleSearchChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }

        params.set('page', '1');
        router.push(`/ump/users?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <input
                        type="search"
                        placeholder="Search by name or email..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                {/* Role Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                    >
                        <option value="">All Roles</option>
                        {USER_ROLE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status</option>
                        {USER_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
