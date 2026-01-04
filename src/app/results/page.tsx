"use client";

import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function ResultsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold">Results</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">View and manage student examination results.</p>
            </div>
        </div>
    );
}
