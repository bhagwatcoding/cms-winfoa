'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Search,
    Plus,
    MapPin,
    Users,
    TrendingUp,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
import Link from 'next/link';

interface Center {
    id: string;
    name: string;
    code: string;
    location: string;
    director: string;
    students: number;
    status: 'active' | 'inactive' | 'pending';
    revenue: string;
    joinedDate: string;
}

export default function CentersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const centers: Center[] = [
        {
            id: '1',
            name: 'ABC Computer Institute',
            code: 'ABC001',
            location: 'Mumbai, Maharashtra',
            director: 'Rajesh Kumar',
            students: 450,
            status: 'active',
            revenue: '₹12.5L',
            joinedDate: '2023-01-15'
        },
        {
            id: '2',
            name: 'XYZ Education Center',
            code: 'XYZ002',
            location: 'Delhi, NCR',
            director: 'Priya Sharma',
            students: 320,
            status: 'active',
            revenue: '₹9.8L',
            joinedDate: '2023-03-20'
        },
        {
            id: '3',
            name: 'Tech Learning Hub',
            code: 'TLH003',
            location: 'Bangalore, Karnataka',
            director: 'Amit Patel',
            students: 180,
            status: 'pending',
            revenue: '₹5.2L',
            joinedDate: '2024-01-05'
        },
    ];

    const filteredCenters = centers.filter(center => {
        const matchesSearch =
            center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || center.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: centers.length,
        active: centers.filter(c => c.status === 'active').length,
        pending: centers.filter(c => c.status === 'pending').length,
        inactive: centers.filter(c => c.status === 'inactive').length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'inactive':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'inactive':
                return <XCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Building2 className="w-8 h-8 text-blue-600" />
                                Centers Management
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage all education centers
                            </p>
                        </div>

                        <Link href="/god">
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                                <Plus className="w-5 h-5" />
                                Add New Center
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Centers</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Active</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pending</p>
                        <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Inactive</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">{stats.inactive}</p>
                    </motion.div>
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
                                placeholder="Search centers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            {['all', 'active', 'pending', 'inactive'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${filterStatus === status
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Centers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters.map((center, index) => (
                        <motion.div
                            key={center.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                                            {center.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-mono">{center.code}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(center.status)}`}>
                                        {getStatusIcon(center.status)}
                                        {center.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4" />
                                        {center.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Users className="w-4 h-4" />
                                        {center.students} Students
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <TrendingUp className="w-4 h-4" />
                                        Revenue: {center.revenue}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <button className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredCenters.length === 0 && (
                    <div className="text-center py-20">
                        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No centers found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}
