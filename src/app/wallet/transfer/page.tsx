'use client';

import { useState } from 'react';
import { transferMoney } from '../actions';
import { Send, UserCheck, ShieldCheck, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TransferPage() {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    async function handleTransfer(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const val = parseFloat(amount);
        if (!val || val <= 0) {
            setMessage({ type: 'error', text: 'Invalid amount' });
            setLoading(false);
            return;
        }

        const res = await transferMoney(email, val);

        if (res.success) {
            setMessage({ type: 'success', text: 'Transfer successful!' });
            setAmount('');
            setEmail('');
            router.refresh();
        } else {
            setMessage({ type: 'error', text: res.error || 'Transfer failed' });
        }
        setLoading(false);
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Transfer Money</h2>
                <p className="text-slate-500 dark:text-slate-400">Send money instantly to other users.</p>
            </div>

            <form onSubmit={handleTransfer} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                        }`}>
                        {message.type === 'success' ? <ShieldCheck size={18} /> : <UserCheck size={18} />}
                        {message.text}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Recipient Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</span>
                            <input
                                type="number"
                                required
                                min="1"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-lg"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        ) : (
                            <>
                                Send Money <Send size={20} />
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck size={14} /> Secure Transfer
                    </p>
                </div>
            </form>
        </div>
    );
}
