
import { getProfile, getUserStats, getRecentActivity } from '@/actions/account'

import { AccountOverview, UserStatsCard, ActivityLogTable } from '@/features/account/components'
import { redirect } from 'next/navigation'

export default async function MyAccountPage() {
    // Get current user profile
    const profileResult = await getProfile()

    if ('error' in profileResult) {
        redirect('http://auth.localhost:3000/login')
    }

    // Get user stats
    const statsResult = await getUserStats()
    const stats = statsResult.success ? statsResult.data : null

    // Get recent activity
    const activityResult = await getRecentActivity(5)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activities = activityResult.success ? (activityResult.data as any[]) : []

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        My Account
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your profile, settings, and activity
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Account Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <AccountOverview user={profileResult.data} />
                        </div>

                        {activities.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <ActivityLogTable activities={activities} />
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats */}
                    <div className="space-y-6">
                        {stats && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <UserStatsCard stats={stats} />
                            </div>
                        )}

                        {/* Quick Links */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <a
                                    href="/myaccount/profile"
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium">Edit Profile</div>
                                    <div className="text-sm text-muted-foreground">
                                        Update your personal information
                                    </div>
                                </a>
                                <a
                                    href="/myaccount/security"
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium">Security</div>
                                    <div className="text-sm text-muted-foreground">
                                        Manage password and security settings
                                    </div>
                                </a>
                                <a
                                    href="/myaccount/settings"
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium">Preferences</div>
                                    <div className="text-sm text-muted-foreground">
                                        Customize notifications and privacy
                                    </div>
                                </a>
                                <a
                                    href="/myaccount/activity"
                                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="font-medium">Activity Log</div>
                                    <div className="text-sm text-muted-foreground">
                                        View your account activity
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const metadata = {
    title: 'My Account - WINFOA',
    description: 'Manage your account settings and preferences'
}
