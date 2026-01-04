"use client";

import React from 'react';
import { History } from 'lucide-react';

export default function WalletTransactionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <History className="h-8 w-8 text-teal-600" />
                <h1 className="text-3xl font-bold">Wallet Transactions</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">View your wallet transaction history.</p>
            </div>
        </div>
    );
}
