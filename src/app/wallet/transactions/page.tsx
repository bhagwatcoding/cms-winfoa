"use client";

import React from 'react';
import { History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WalletTransactionsPage() {
    const transactions = [
        { id: 1, type: 'credit', amount: 2000, description: 'Wallet Recharge', date: '2024-01-04', time: '10:30 AM', status: 'completed' },
        { id: 2, type: 'debit', amount: 500, description: 'Student Registration Fee', date: '2024-01-03', time: '02:15 PM', status: 'completed' },
        { id: 3, type: 'debit', amount: 250, description: 'Certificate Fee', date: '2024-01-02', time: '11:45 AM', status: 'completed' },
        { id: 4, type: 'credit', amount: 1000, description: 'Cashback Bonus', date: '2024-01-01', time: '09:00 AM', status: 'completed' },
        { id: 5, type: 'debit', amount: 143, description: 'Admit Card Fee', date: '2023-12-30', time: '03:20 PM', status: 'completed' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-teal-100 p-3">
                        <History className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Wallet Transactions</h1>
                        <p className="text-sm text-slate-500">View your complete transaction history</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹3,000</div>
                        <p className="text-xs text-slate-500">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹893</div>
                        <p className="text-xs text-slate-500">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">₹107</div>
                        <p className="text-xs text-slate-500">Current balance</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>All your wallet transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`rounded-full p-2 ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {transaction.type === 'credit' ? (
                                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-xs text-slate-500">
                                            {transaction.date} at {transaction.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                                    </p>
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
