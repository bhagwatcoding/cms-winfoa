"use client";

import React from 'react';
import { Download } from 'lucide-react';

export default function DownloadsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-yellow-600" />
                <h1 className="text-3xl font-bold">Downloads</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Download forms, certificates, and other documents.</p>
            </div>
        </div>
    );
}
