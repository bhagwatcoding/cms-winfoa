'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    TrendingUp,
    TrendingDown,
    Users,
    Building2,
    DollarSign,
    Award,
    Calendar,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

export default function AnalyticsPage() {
    const metrics = [
        {
            title: 'Total Revenue',
            value: '₹45.2L',
            change: '+32.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'New Students',
            value: '2,847',
            change: '+18.2%',
            trend: 'up',
            icon: Users,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            title: 'Active Centers',
            value: '156',
            change: '+12.5%',
            trend: 'up',
            icon: Building2,
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Certificates Issued',
            value: '1,234',
            change: '-5.2%',
            trend: 'down',
            icon: Award,
            color: 'from-orange-500 to-red-500'
        },
    ];

    const monthlyData = [
        { month: 'Jan', revenue: 3.2, students: 450 },
        { month: 'Feb', revenue: 3.8, students: 520 },
        { month: 'Mar', revenue: 4.1, students: 580 },
        { month: 'Apr', revenue: 3.9, students: 490 },
        { month: 'May', revenue: 4.5, students: 620 },
        { month: 'Jun', revenue: 5.2, students: 720 },
    ];

    const topCenters = [
        { name: 'ABC Institute', revenue: '₹8.5L', students: 450, growth: '+25%' },
        { name: 'XYZ Center', revenue: '₹6.2L', students: 320, growth: '+18%' },
        { name: 'Tech Hub', revenue: '₹5.1L', students: 280, growth: '+15%' },
        { name: 'Learning Point', revenue: '₹4.8L', students: 250, growth: '+12%' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                            <Activity className="w-8 h-8 text-green-600" />
                            Analytics Dashboard
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            System-wide performance metrics and insights
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center`}>
                                    <metric.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    {metric.change}
                                </div>
                            </div>
                            <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">{metric.title}</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Monthly Performance</h2>
                        <div className="space-y-4">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-16 text-sm font-medium text-slate-600 dark:text-slate-400">
                                        {data.month}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex-1">
                                                <div className="h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg relative overflow-hidden"
                                                    style={{ width: `${(data.revenue / 6) * 100}%` }}>
                                                    <div className="absolute inset-0 bg-white/20"></div>
                                                </div>
                                            </div>
                                            <div className="w-20 text-sm font-semibold text-slate-900 dark:text-white">
                                                ₹{data.revenue}L
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg relative overflow-hidden"
                                                    style={{ width: `${(data.students / 800) * 100}%` }}>
                                                    <div className="absolute inset-0 bg-white/20"></div>
                                                </div>
                                            </div>
                                            <div className="w-20 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {data.students} students
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Centers */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Top Performing Centers</h2>
                        <div className="space-y-4">
                            {topCenters.map((center, index) => (
                                <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{center.name}</h3>
                                        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {center.growth}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">{center.students} students</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{center.revenue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
