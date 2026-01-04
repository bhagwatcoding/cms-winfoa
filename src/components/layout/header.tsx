"use client";

import React from 'react';
import { Wallet, Menu } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 border-b bg-white/80 backdrop-blur-md">
            <div className="flex h-full items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-slate-700 hover:bg-slate-100 rounded-lg p-2"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">Welcome Purushottam Singh</span>
                        <span className="text-[10px] text-slate-500">Joined On: 23/09/2023</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-red-700 border border-red-200">
                        <span className="text-xs font-semibold">Branch Code: BR-141</span>
                    </div>

                    <button className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700 transition-colors shadow-sm">
                        <Wallet className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium hidden sm:inline">Wallet Recharge</span>
                    </button>

                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-green-700 border border-green-200">
                        <span className="text-xs font-semibold uppercase">₹107.00</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
