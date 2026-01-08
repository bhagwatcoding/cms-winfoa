'use client';

import { useState } from 'react';
import { payBill } from '../actions';
import { Smartphone, Zap, Tv, Wifi, Database, Car, Flame, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BillsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [provider, setProvider] = useState('');
    const [identifier, setIdentifier] = useState(''); // Mobile No, Customer ID, etc.
    const [amount, setAmount] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const categories = [
        { id: 'mobile', label: 'Mobile Prepaid', icon: <Smartphone size={24} />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { id: 'electricity', label: 'Electricity', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
        { id: 'dth', label: 'DTH / Cable', icon: <Tv size={24} />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
        { id: 'broadband', label: 'Broadband', icon: <Wifi size={24} />, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
        { id: 'gas', label: 'Piped Gas', icon: <Flame size={24} />, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
        { id: 'fastag', label: 'FASTag', icon: <Car size={24} />, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    ];

    async function handlePay(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const val = parseFloat(amount);
        if (!val || val <= 0) {
            setMessage({ type: 'error', text: 'Invalid amount' });
            setLoading(false);
            return;
        }

        const billDetails = {
            category: selectedCategory,
            provider,
            identifier
        };

        const res = await payBill(val, billDetails);

        if (res.success) {
            setMessage({ type: 'success', text: `Bill paid successfully!` });
            setAmount('');
            setProvider('');
            setIdentifier('');
            setSelectedCategory(null);
            router.refresh();
        } else {
            setMessage({ type: 'error', text: res.error || 'Payment failed' });
        }
        setLoading(false);
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pay Bills</h2>
                <p className="text-slate-500 dark:text-slate-400">Securely pay your utility bills with zero fees.</p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setSelectedCategory(cat.id);
                            setMessage(null);
                        }}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all ${selectedCategory === cat.id
                                ? 'bg-white dark:bg-slate-800 ring-2 ring-indigo-500 shadow-lg scale-105'
                                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:scale-105 shadow-sm'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.color}`}>
                            {cat.icon}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Payment Form */}
            {selectedCategory && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <form onSubmit={handlePay} className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                            {categories.find(c => c.id === selectedCategory)?.icon}
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                    Pay {categories.find(c => c.id === selectedCategory)?.label} Bill
                                </h3>
                                <p className="text-xs text-slate-500">Enter details to fetch bill</p>
                            </div>
                        </div>

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
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Service Provider</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    value={provider}
                                    onChange={(e) => setProvider(e.target.value)}
                                >
                                    <option value="">Select Provider</option>
                                    <option value="provider1">Airtel</option>
                                    <option value="provider2">Jio</option>
                                    <option value="provider3">Vi</option>
                                    <option value="provider4">BSNL</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {selectedCategory === 'mobile' ? 'Mobile Number' : 'Consumer ID / Account No'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                                    placeholder="XXXXXXXXXX"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
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
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                ) : (
                                    <>
                                        Pay Bill <Zap size={20} fill="currentColor" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
