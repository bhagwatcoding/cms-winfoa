"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function SupportPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <HelpCircle className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold">Contact Support</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Get help and contact our support team.</p>
            </div>
        </div>
    );
}
