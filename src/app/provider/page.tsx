'use client';

import {
    Building2, Users, TrendingUp, DollarSign,
    Shield, CheckCircle2, Activity, Settings
} from 'lucide-react';
import { StatsGrid, QuickActions, SystemHealth, RecentActivities, Stat, RecentActivity } from '@/features/admin/components';

export default function GodDashboard() {
    const stats: Stat[] = [
        {
            title: 'Total Centers',
            value: '156',
            change: '+12%',
            trend: 'up',
            icon: Building2,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Total Users',
            value: '12,847',
            change: '+18%',
            trend: 'up',
            icon: Users,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Active Students',
            value: '45,231',
            change: '+24%',
            trend: 'up',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Revenue (MTD)',
            value: '₹12.5L',
            change: '+32%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-orange-500 to-red-500'
        },
    ];

    const recentActivities: RecentActivity[] = [
        {
            type: 'center',
            message: 'New center registered: ABC Institute',
            time: '5 minutes ago',
            icon: Building2,
            color: 'text-blue-600'
        },
        {
            type: 'user',
            message: '1,234 new students enrolled today',
            time: '15 minutes ago',
            icon: Users,
            color: 'text-purple-600'
        },
        {
            type: 'certificate',
            message: '567 certificates issued',
            time: '1 hour ago',
            icon: CheckCircle2,
            color: 'text-green-600'
        },
        {
            type: 'alert',
            message: 'System backup completed successfully',
            time: '2 hours ago',
            icon: Shield,
            color: 'text-orange-600'
        },
    ];

    const quickActions = [
        {
            title: 'Manage Centers',
            description: 'View and manage all education centers',
            icon: Building2,
            href: '/god/centers',
            color: 'from-blue-600 to-indigo-600'
        },
        {
            title: 'User Management',
            description: 'Manage users and permissions',
            icon: Users,
            href: '/god/users',
            color: 'from-purple-600 to-pink-600'
        },
        {
            title: 'Analytics',
            description: 'View system-wide analytics',
            icon: Activity,
            href: '/god/analytics',
            color: 'from-green-600 to-emerald-600'
        },
        {
            title: 'System Settings',
            description: 'Configure system settings',
            icon: Settings,
            href: '/god/settings',
            color: 'from-orange-600 to-red-600'
        },
    ];

    const systemHealth = [
        { name: 'API Server', status: 'healthy', uptime: '99.9%', color: 'bg-green-500' },
        { name: 'Database', status: 'healthy', uptime: '99.8%', color: 'bg-green-500' },
        { name: 'Storage', status: 'warning', uptime: '98.5%', color: 'bg-yellow-500' },
        { name: 'Email Service', status: 'healthy', uptime: '99.7%', color: 'bg-green-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Shield className="w-8 h-8 text-purple-600" />
                                God Panel
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                System-wide control and monitoring
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                    All Systems Operational
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <StatsGrid stats={stats} />

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <QuickActions actions={quickActions} />
                        <SystemHealth services={systemHealth} />
                    </div>
                    <RecentActivities activities={recentActivities} />
                </div>
            </div>
        </div>
    );
}
