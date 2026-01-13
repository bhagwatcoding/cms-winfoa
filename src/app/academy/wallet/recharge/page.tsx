'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    CreditCard,
    IndianRupee,
    History,
    ArrowRight,
    Smartphone,
    Building2,
    CheckCircle2,
    Zap
} from 'lucide-react';
import Link from 'next/link';

export default function WalletRechargePage() {
    const [amount, setAmount] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    const currentBalance = 1250.50;
    const quickAmounts = [500, 1000, 2000, 5000, 10000];

    const paymentMethods = [
        { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm' },
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
        { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
    ];

    const handleQuickSelect = (value: number) => {
        setSelectedAmount(value);
        setAmount(value.toString());
    };

    const handleRecharge = () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }
        alert(`Proceeding to payment gateway for ₹${amount} via ${selectedMethod}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                                <Wallet className="w-8 h-8 text-green-600" />
                                Wallet Recharge
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Add funds to your wallet instantly
                            </p>
                        </div>

                        <Link href="/center/wallet/transactions">
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">
                                <History className="w-5 h-5" />
                                Transaction History
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Current Balance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-2">Current Balance</p>
                            <p className="text-5xl font-bold text-white">₹{currentBalance.toFixed(2)}</p>
                        </div>
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                            <IndianRupee className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Recharge Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Select Amounts */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Select Amount</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {quickAmounts.map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => handleQuickSelect(value)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedAmount === value
                                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 scale-105'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-green-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <p className="text-sm font-semibold">₹{value}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Custom Amount */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Custom Amount</h3>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        setSelectedAmount(null);
                                    }}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-lg font-semibold"
                                    min="1"
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-2">Minimum recharge: ₹100</p>
                        </motion.div>

                        {/* Payment Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800"
                        >
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Payment Method</h3>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${selectedMethod === method.id
                                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-green-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedMethod === method.id
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}>
                                            <method.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="font-semibold text-slate-900 dark:text-white">{method.name}</p>
                                            <p className="text-sm text-slate-500">{method.description}</p>
                                        </div>
                                        {selectedMethod === method.id && (
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Proceed Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            onClick={handleRecharge}
                            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-6 h-6" />
                            Proceed to Payment
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Right Column - Benefits */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
                        >
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Why Recharge?
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'Instant credit to wallet',
                                    'Secure payment gateway',
                                    'Multiple payment options',
                                    '24/7 customer support',
                                    'Detailed transaction history',
                                    'No hidden charges'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <p className="text-sm text-blue-900 dark:text-blue-100">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
                        >
                            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Need Help?</h3>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                                If you face any issues during recharge, our support team is here to help you 24/7.
                            </p>
                            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                Contact Support
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
