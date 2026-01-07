"use client";

import React from 'react';
import { Wallet, Menu, Users, UserCheck, GraduationCap } from 'lucide-react';

interface Stats {
    total: number;
    active: number;
    completed: number;
}

interface HeaderProps {
    onMenuClick: () => void;
    userName?: string;
    joinedAt?: string;
    centerCode?: string;
    walletBalance?: number;
    stats?: Stats | null;
}

export function Header({ onMenuClick, userName, joinedAt, centerCode, walletBalance, stats }: HeaderProps) {
    const formattedDate = joinedAt ? new Date(joinedAt).toLocaleDateString() : 'N/A';

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 border-b bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex h-full items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-slate-700 hover:bg-slate-100 rounded-lg p-2 transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">Welcome {userName || 'User'}</span>
                        <span className="text-[10px] text-slate-500">Joined: {formattedDate}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Student Stats - Hidden on small screens */}
                    {stats && (
                        <div className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 border border-blue-200" title="Total Students">
                                <Users className="h-3.5 w-3.5 text-blue-600" />
                                <span className="text-xs font-semibold text-blue-700">{stats.total}</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 border border-green-200" title="Active Students">
                                <UserCheck className="h-3.5 w-3.5 text-green-600" />
                                <span className="text-xs font-semibold text-green-700">{stats.active}</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 border border-purple-200" title="Completed">
                                <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                                <span className="text-xs font-semibold text-purple-700">{stats.completed}</span>
                            </div>
                        </div>
                    )}

                    {/* Branch Code */}
                    <div className="hidden sm:flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 border border-red-200">
                        <span className="text-xs font-semibold text-red-700">Code: {centerCode || 'N/A'}</span>
                    </div>

                    {/* Wallet Balance */}
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 border border-green-200">
                        <Wallet className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">
                            {walletBalance !== undefined ? `₹${walletBalance.toFixed(2)}` : '₹0.00'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
