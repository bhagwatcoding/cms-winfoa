'use client'

import { User, Mail, Phone, Shield, Calendar } from 'lucide-react'
import { Badge } from '@/ui/badge'

interface AccountOverviewProps {
    user: {
        firstName?: string
        lastName?: string
        name?: string
        email: string
        phone?: string
        role?: string
        emailVerified: boolean
        status?: string
        joinedAt?: Date | string
        createdAt?: Date | string
        oauthProvider?: string
    }
}

export function AccountOverview({ user }: AccountOverviewProps) {
    const joinedDate = new Date(user.joinedAt || user.createdAt || new Date())
    const isActive = user.status === 'active'
    const fullName = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'User')

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Account Overview</h3>
                    <p className="text-sm text-muted-foreground">
                        Your account information at a glance
                    </p>
                </div>
                <Badge variant={isActive ? 'default' : 'secondary'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="font-semibold truncate">{fullName}</p>
                    </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-semibold truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                            {user.emailVerified ? (
                                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    <Shield className="h-3 w-3" />
                                    Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                    Not Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Phone */}
                {user.phone && (
                    <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="font-semibold truncate">{user.phone}</p>
                        </div>
                    </div>
                )}

                {/* Role */}
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                        <p className="font-semibold capitalize">{user.role}</p>
                        {user.oauthProvider && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Connected via {user.oauthProvider}
                            </p>
                        )}
                    </div>
                </div>

                {/* Member Since */}
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card md:col-span-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                        <p className="font-semibold">
                            {joinedDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
