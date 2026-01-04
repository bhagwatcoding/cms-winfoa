"use client";

import React from 'react';
import { Award } from 'lucide-react';

export default function CertificatePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-cyan-600" />
                <h1 className="text-3xl font-bold">Branch Certificate</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Generate and manage branch certificates.</p>
            </div>
        </div>
    );
}
