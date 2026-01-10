'use client'

import { formatDistanceToNow } from 'date-fns'
import {
    Calendar,
    Clock,
    Activity,
    CheckCircle2,
    Shield
} from 'lucide-react'

interface UserStatsProps {
    stats: {
        memberSince: Date | string
        lastLogin?: Date | string
        totalActivities: number
        recentActivities: Record<string, unknown>[]
        emailVerified: boolean
        oauthConnected: boolean
    }
}

export function UserStatsCard({ stats }: UserStatsProps) {
    const memberSince = new Date(stats.memberSince)
    const lastLogin = stats.lastLogin ? new Date(stats.lastLogin) : null

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Account Statistics</h3>
                <p className="text-sm text-muted-foreground">
                    Your account overview and activity summary
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Member Since</p>
                            <p className="font-semibold">
                                {memberSince.toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(memberSince, { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Login</p>
                            {lastLogin ? (
                                <>
                                    <p className="font-semibold">
                                        {lastLogin.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(lastLogin, { addSuffix: true })}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">Never</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Activities</p>
                            <p className="font-semibold text-2xl">{stats.totalActivities}</p>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Security Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                {stats.emailVerified && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Email Verified
                                    </span>
                                )}
                                {stats.oauthConnected && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                        <CheckCircle2 className="h-3 w-3" />
                                        OAuth
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
