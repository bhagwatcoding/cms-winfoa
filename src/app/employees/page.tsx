"use client";

import React from 'react';
import { UserSquare2 } from 'lucide-react';

export default function EmployeesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <UserSquare2 className="h-8 w-8 text-teal-600" />
                <h1 className="text-3xl font-bold">Employees</h1>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
                <p className="text-slate-600">Manage your branch employees and staff.</p>
            </div>
        </div>
    );
}
