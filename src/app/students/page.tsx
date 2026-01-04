"use client";

import React from 'react';
import { Users } from 'lucide-react';

export default function StudentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold">Students</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Student management and list will be displayed here.</p>
            </div>
        </div>
    );
}
