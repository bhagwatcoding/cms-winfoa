'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Plus,
    Phone,
    Edit,
    Trash2,
    Eye,
    UserCheck,
    Crown,
    Building2,
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'super-admin' | 'center-admin' | 'employee' | 'student';
    center?: string;
    status: 'active' | 'inactive' | 'suspended';
    joinedDate: string;
    lastActive: string;
}

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const users: User[] = [
        {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            phone: '+91 98765 43210',
            role: 'super-admin',
            status: 'active',
            joinedDate: '2023-01-01',
            lastActive: '2 minutes ago'
        },
        {
            id: '2',
            name: 'Rajesh Kumar',
            email: 'rajesh@abc.com',
            phone: '+91 98765 43211',
            role: 'center-admin',
            center: 'ABC Institute',
            status: 'active',
            joinedDate: '2023-02-15',
            lastActive: '1 hour ago'
        },
        {
            id: '3',
            name: 'Priya Sharma',
            email: 'priya@xyz.com',
            phone: '+91 98765 43212',
            role: 'employee',
            center: 'XYZ Center',
            status: 'active',
            joinedDate: '2023-05-20',
            lastActive: '5 hours ago'
        },
        {
            id: '4',
            name: 'Amit Patel',
            email: 'amit@student.com',
            phone: '+91 98765 43213',
            role: 'student',
            center: 'ABC Institute',
            status: 'active',
            joinedDate: '2024-01-10',
            lastActive: '1 day ago'
        },
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);

        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        superAdmin: users.filter(u => u.role === 'super-admin').length,
        centerAdmin: users.filter(u => u.role === 'center-admin').length,
    };

    const getRoleBadge = (role: string) => {
        const configs = {
            'super-admin': { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Crown },
            'center-admin': { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Building2 },
            'employee': { color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: UserCheck },
            'student': { color: 'bg-orange-500/10 text-orange-600 border-orange-500/20', icon: Users },
        };
        return configs[role as keyof typeof configs] || configs.student;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'inactive': return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
            case 'suspended': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Users className="w-8 h-8 text-purple-600" />
                                Users Management
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage all system users and permissions
                            </p>
                        </div>

                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                            <Plus className="w-5 h-5" />
                            Add New User
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Users', value: stats.total, color: 'from-purple-500 to-pink-500', icon: Users },
                        { label: 'Active Users', value: stats.active, color: 'from-green-500 to-emerald-500', icon: UserCheck },
                        { label: 'Super Admins', value: stats.superAdmin, color: 'from-orange-500 to-red-500', icon: Crown },
                        { label: 'Center Admins', value: stats.centerAdmin, color: 'from-blue-500 to-indigo-500', icon: Building2 },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                                    <stat.icon className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                        </div>

                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="super-admin">Super Admin</option>
                            <option value="center-admin">Center Admin</option>
                            <option value="employee">Employee</option>
                            <option value="student">Student</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Center</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Last Active</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredUsers.map((user, index) => {
                                    const roleBadge = getRoleBadge(user.role);
                                    return (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.05 }}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                        <p className="text-sm text-slate-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <Phone className="w-4 h-4" />
                                                    {user.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 w-fit ${roleBadge.color}`}>
                                                    <roleBadge.icon className="w-3 h-3" />
                                                    {user.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {user.center || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(user.status)}`}>
                                                    {user.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {user.lastActive}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
