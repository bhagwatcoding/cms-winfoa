'use client';

import { useState } from 'react';
import { rechargeWallet } from '../actions';
import { CreditCard, Smartphone, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RechargePage() {
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'upi' | 'card'>('upi');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const presets = [100, 500, 1000, 2000, 5000];

    async function handleRecharge() {
        const val = parseFloat(amount);
        if (!val || val <= 0) return;

        setLoading(true);
        // Simulate minor delay
        await new Promise(r => setTimeout(r, 800));

        const res = await rechargeWallet(val, method);
        if (res.success) {
            router.push('/wallet?refresh=true');
        } else {
            alert('Recharge failed');
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Money</h2>
                <p className="text-slate-500 dark:text-slate-400">Recharge your wallet securely using UPI or Cards.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">

                {/* Amount Input */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Enter Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-bold">₹</span>
                        <input
                            type="number"
                            className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-2xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 transition-all"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {presets.map(amt => (
                            <button
                                key={amt}
                                onClick={() => setAmount(amt.toString())}
                                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                            >
                                ₹{amt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMethod('upi')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${method === 'upi'
                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                                : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 text-slate-500'
                                }`}
                        >
                            <Smartphone size={24} />
                            <span className="font-semibold">UPI</span>
                        </button>
                        <button
                            onClick={() => setMethod('card')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${method === 'card'
                                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                                : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 text-slate-500'
                                }`}
                        >
                            <CreditCard size={24} />
                            <span className="font-semibold">Card</span>
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <button
                    disabled={loading || !amount}
                    onClick={handleRecharge}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                        <>
                            Proceed to Pay <Zap size={20} fill="currentColor" />
                        </>
                    )}
                </button>

            </div>
        </div>
    );
}
