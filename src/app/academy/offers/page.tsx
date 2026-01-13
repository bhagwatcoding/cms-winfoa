"use client";

import React from 'react';
import { Gift } from 'lucide-react';

export default function OffersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Gift className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl font-bold">Monthly Offer</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Check out this month&apos;s special offers and promotions.</p>
            </div>
        </div>
    );
}
