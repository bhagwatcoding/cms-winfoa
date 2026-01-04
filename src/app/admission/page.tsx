"use client";

import React from 'react';
import { UserPlus } from 'lucide-react';

export default function AdmissionPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <UserPlus className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold">New Admission</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Student admission form will be implemented here.</p>
            </div>
        </div>
    );
}
