"use client";

import React from 'react';
import { CreditCard } from 'lucide-react';

export default function AdmitCardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-orange-600" />
                <h1 className="text-3xl font-bold">Admit Card</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Generate and download admit cards for students.</p>
            </div>
        </div>
    );
}
