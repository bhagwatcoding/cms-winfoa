"use client";

import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold">Notifications</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">View all your notifications and updates.</p>
            </div>
        </div>
    );
}
