'use client'

import { formatDistanceToNow } from 'date-fns'
import {
    Shield,
    Mail,
    User,
    Settings,
    LogIn,
    LogOut,
    Key,
    Trash2
} from 'lucide-react'

interface Activity {
    _id: string
    action: string | number
    createdAt: Date | string
    ipAddress?: string
    details?: string
    metadata?: Record<string, unknown>
}

interface ActivityLogTableProps {
    activities: Activity[]
}

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    login: LogIn,
    logout: LogOut,
    password_change: Key,
    email_change: Mail,
    profile_update: User,
    settings_update: Settings,
    account_delete: Trash2,
    oauth_connected: Shield,
    oauth_disconnected: Shield,
    two_factor_enabled: Shield,
    two_factor_disabled: Shield,
}

const actionLabels: Record<string, string> = {
    login: 'Signed in',
    logout: 'Signed out',
    password_change: 'Changed password',
    email_change: 'Changed email',
    profile_update: 'Updated profile',
    settings_update: 'Updated settings',
    account_delete: 'Deleted account',
    oauth_connected: 'Connected OAuth',
    oauth_disconnected: 'Disconnected OAuth',
    two_factor_enabled: 'Enabled 2FA',
    two_factor_disabled: 'Disabled 2FA',
}

export function ActivityLogTable({ activities }: ActivityLogTableProps) {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-12">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No activity yet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Your account activity will appear here
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                    Your account activity from the last 90 days
                </p>
            </div>

            <div className="space-y-2">
                {activities.map((activity) => {
                    const Icon = actionIcons[String(activity.action)] || Shield
                    const label = actionLabels[String(activity.action)] || String(activity.action)
                    const timestamp = new Date(activity.createdAt)

                    return (
                        <div
                            key={activity._id}
                            className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="mt-0.5">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(timestamp, { addSuffix: true })}
                                </p>
                                {activity.ipAddress && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        IP: {activity.ipAddress}
                                    </p>
                                )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {timestamp.toLocaleString()}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
