"use client";

import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-orange-600" />
                <h1 className="text-3xl font-bold">Terms & Conditions</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Read the terms and conditions for using this platform.</p>
            </div>
        </div>
    );
}
