'use client';

import { useEffect, useState } from 'react';
import { getRecentTransactions } from '../actions'; // We can reuse or create a more specific 'getAllTransactions' if needed with pagination
import { ArrowDownLeft, ArrowUpRight, Search, Download } from 'lucide-react';

interface Transaction {
    _id: string;
    type: 'credit' | 'debit';
    description: string;
    amount: number;
    status: string;
    paymentMethod?: string;
    transactionId?: string;
    createdAt: string;
}

// Reusing the same action for this demo, in real app add pagination/filtering params to action
export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            // Fetching more for history page
            const txData = await getRecentTransactions(50);

            if (txData && !txData.error) {
                setTransactions(txData.transactions || []);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transaction History</h2>
                    <p className="text-slate-500 dark:text-slate-400">View your past deposits and expenses.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 flex items-center gap-2">
                        <Download size={18} /> Export
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">Transaction Details</th>
                                <th className="px-6 py-4">Ref ID</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transactions found.</td></tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit'
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                    {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{tx.description}</p>
                                                    <p className="text-xs text-slate-500">{tx.paymentMethod || 'Wallet'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{tx.transactionId}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(tx.createdAt).toLocaleDateString()} <br />
                                            <span className="text-xs opacity-70">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                                tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-rose-100 text-rose-800'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                                                }`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
