'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell, Search, Check, Trash2, AlertCircle, Info, CheckCircle2, XCircle, Calendar, Clock, Filter
} from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
}

export default function NotificationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'New Student Admission',
            message: 'Rajesh Kumar has been successfully admitted to ADCA course.',
            type: 'success',
            timestamp: '2024-01-06T10:30:00',
            read: false
        },
        {
            id: '2',
            title: 'Exam Schedule Updated',
            message: 'The exam schedule for March 2024 has been updated. Please check the new dates.',
            type: 'info',
            timestamp: '2024-01-06T09:15:00',
            read: false
        },
        {
            id: '3',
            title: 'Payment Pending',
            message: 'Fee payment is pending for 5 students. Please follow up.',
            type: 'warning',
            timestamp: '2024-01-05T16:45:00',
            read: true
        },
        {
            id: '4',
            title: 'Certificate Ready',
            message: 'Certificates for batch 2023-24 are ready for download.',
            type: 'success',
            timestamp: '2024-01-05T14:20:00',
            read: true
        },
        {
            id: '5',
            title: 'System Maintenance',
            message: 'System will be under maintenance on Sunday from 2 AM to 6 AM.',
            type: 'warning',
            timestamp: '2024-01-04T11:00:00',
            read: true
        },
    ]);

    const filteredNotifications = notifications.filter(notif => {
        const matchesSearch =
            notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notif.message.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterType === 'all' ||
            (filterType === 'unread' && !notif.read) ||
            (filterType === 'read' && notif.read) ||
            notif.type === filterType;

        return matchesSearch && matchesFilter;
    });

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                    bgGradient: 'from-emerald-600 to-green-600',
                    icon: <CheckCircle2 className="w-5 h-5" />
                };
            case 'warning':
                return {
                    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                    bgGradient: 'from-amber-600 to-orange-600',
                    icon: <AlertCircle className="w-5 h-5" />
                };
            case 'error':
                return {
                    color: 'bg-red-500/10 text-red-600 border-red-500/20',
                    bgGradient: 'from-red-600 to-rose-600',
                    icon: <XCircle className="w-5 h-5" />
                };
            default:
                return {
                    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                    bgGradient: 'from-blue-600 to-indigo-600',
                    icon: <Info className="w-5 h-5" />
                };
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const getRelativeTime = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now.getTime() - time.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const stats = {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        success: notifications.filter(n => n.type === 'success').length,
        warning: notifications.filter(n => n.type === 'warning').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Bell className="w-8 h-8 text-purple-600" />
                                Notifications
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Stay updated with important announcements
                            </p>
                        </div>

                        {stats.unread > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                            >
                                <Check className="w-5 h-5" />
                                Mark All as Read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <Bell className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Unread</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.unread}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <AlertCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Success</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.success}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Warnings</p>
                                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.warning}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                <AlertCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {['all', 'unread', 'read', 'success', 'info', 'warning', 'error'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setFilterType(filter)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${filterType === filter
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.map((notif, index) => {
                        const typeConfig = getTypeConfig(notif.type);

                        return (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 ${!notif.read ? 'ring-2 ring-purple-500/20' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4 p-6">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 bg-gradient-to-br ${typeConfig.bgGradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <div className="text-white">
                                            {typeConfig.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {notif.title}
                                                {!notif.read && (
                                                    <span className="ml-2 inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
                                                )}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${typeConfig.color}`}>
                                                {notif.type.toUpperCase()}
                                            </span>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                                            {notif.message}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {getRelativeTime(notif.timestamp)}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(notif.timestamp).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        {!notif.read && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="p-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-all"
                                                title="Mark as read"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notif.id)}
                                            className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredNotifications.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No notifications found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
