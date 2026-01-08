'use client';

import { useState } from 'react';
import { withdrawMoney } from '../actions';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function WithdrawPage() {
    const [amount, setAmount] = useState('');
    const [bankUser, setBankUser] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifsc, setIfsc] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    async function handleWithdraw(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const val = parseFloat(amount);
        if (!val || val <= 0) {
            setMessage({ type: 'error', text: 'Invalid amount' });
            setLoading(false);
            return;
        }

        const bankDetails = {
            accountHolder: bankUser,
            accountNumber,
            ifsc
        };

        const res = await withdrawMoney(val, bankDetails);

        if (res.success) {
            setMessage({ type: 'success', text: 'Withdrawal request submitted successfully' });
            setAmount('');
            setAccountNumber('');
            setIfsc('');
            setBankUser('');
            router.refresh();
        } else {
            setMessage({ type: 'error', text: res.error || 'Withdrawal failed' });
        }
        setLoading(false);
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Withdraw Funds</h2>
                <p className="text-slate-500 dark:text-slate-400">Transfer your wallet balance to your bank account.</p>
            </div>

            <form onSubmit={handleWithdraw} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                        }`}>
                        <ShieldCheck size={18} />
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</span>
                            <input
                                type="number"
                                required
                                min="100"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-lg"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-slate-400">Minimum withdrawal: ₹100</p>
                    </div>

                    <div className="pt-2 pb-2">
                        <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Holder Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="As per bank records"
                                value={bankUser}
                                onChange={(e) => setBankUser(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Number</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                placeholder="XXXXXXXXX"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">IFSC Code</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase"
                                placeholder="SBIN000..."
                                value={ifsc}
                                onChange={(e) => setIfsc(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></span>
                        ) : (
                            <>
                                Withdraw Funds <ArrowUpRight size={20} />
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                        <Landmark size={14} /> Bank Transfer (2-3 business days)
                    </p>
                </div>
            </form>
        </div>
    );
}
