"use client";

import React from 'react';
import { Lock } from 'lucide-react';

export default function ChangePasswordPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Lock className="h-8 w-8 text-red-600" />
                <h1 className="text-3xl font-bold">Change Password</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Update your account password.</p>
            </div>
        </div>
    );
}
