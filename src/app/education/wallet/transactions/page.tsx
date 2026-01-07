'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    History,
    Download,
    Search,
    TrendingUp,
    TrendingDown,
    Calendar,
    ArrowUpCircle,
    ArrowDownCircle,
    Wallet,
    Filter
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    balance: number;
}

export default function WalletTransactionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const transactions: Transaction[] = [
        {
            id: 'TXN001',
            type: 'credit',
            amount: 5000,
            description: 'Wallet Recharge via UPI',
            date: '2026-01-04T10:30:00',
            status: 'completed',
            balance: 6250.50
        },
        {
            id: 'TXN002',
            type: 'debit',
            amount: 500,
            description: 'Student Admission Fee',
            date: '2026-01-03T15:45:00',
            status: 'completed',
            balance: 1250.50
        },
        {
            id: 'TXN003',
            type: 'credit',
            amount: 2000,
            description: 'Wallet Recharge via Card',
            date: '2026-01-02T09:15:00',
            status: 'completed',
            balance: 1750.50
        },
        {
            id: 'TXN004',
            type: 'debit',
            amount: 250,
            description: 'Certificate Generation',
            date: '2026-01-01T14:20:00',
            status: 'completed',
            balance: -250.50
        },
        {
            id: 'TXN005',
            type: 'credit',
            amount: 1000,
            description: 'Wallet Recharge via Net Banking',
            date: '2025-12-30T11:00:00',
            status: 'pending',
            balance: -250.50
        },
    ];

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || txn.type === filterType;
        const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const totalCredit = transactions
        .filter(t => t.type === 'credit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
        .filter(t => t.type === 'debit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'pending':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
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
                                <History className="w-8 h-8 text-blue-600" />
                                Transaction History
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                View all your wallet transactions
                            </p>
                        </div>

                        <Link href="/center/wallet/recharge">
                            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105">
                                <Wallet className="w-5 h-5" />
                                Recharge Wallet
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Credit</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">₹{totalCredit.toFixed(2)}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                                <ArrowDownCircle className="w-7 h-7 text-white" />
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
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Debit</p>
                                <p className="text-3xl font-bold text-red-600 mt-2">₹{totalDebit.toFixed(2)}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center">
                                <ArrowUpCircle className="w-7 h-7 text-white" />
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
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Net Balance</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">
                                    ₹{(totalCredit - totalDebit).toFixed(2)}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
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
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="credit">Credit</option>
                                <option value="debit">Debit</option>
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>

                            <button className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Transactions List */}
                <div className="space-y-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No transactions found</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Your transaction history will appear here'}
                            </p>
                        </div>
                    ) : (
                        filteredTransactions.map((txn, index) => (
                            <motion.div
                                key={txn.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${txn.type === 'credit'
                                                ? 'bg-emerald-100 dark:bg-emerald-950/20'
                                                : 'bg-red-100 dark:bg-red-950/20'
                                            }`}>
                                            {txn.type === 'credit' ? (
                                                <ArrowDownCircle className="w-6 h-6 text-emerald-600" />
                                            ) : (
                                                <ArrowUpCircle className="w-6 h-6 text-red-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">{txn.description}</h3>
                                                <span className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(txn.status)}`}>
                                                    {txn.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(txn.date)}
                                                </span>
                                                <span className="font-mono">{txn.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                                            }`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
