"use client";

import React from 'react';
import { Wallet } from 'lucide-react';

export default function WalletRechargePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold">Wallet Recharge</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Recharge your wallet balance.</p>
            </div>
        </div>
    );
}
