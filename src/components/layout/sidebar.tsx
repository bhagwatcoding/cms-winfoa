"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    UserPlus,
    Users,
    CreditCard,
    GraduationCap,
    Download,
    Award,
    Wallet,
    History,
    Gift,
    FileText,
    UserSquare2,
    Bell,
    HelpCircle,
    Lock,
    LogOut,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: UserPlus, label: 'New Admission', href: '/admission' },
    { icon: Users, label: 'Students', href: '/students' },
    { icon: CreditCard, label: 'Admit Card', href: '/admit-card' },
    { icon: GraduationCap, label: 'Results', href: '/results' },
    { icon: Download, label: 'Downloads', href: '/downloads' },
    { icon: Award, label: 'Branch Certificate', href: '/certificate' },
    { icon: Wallet, label: 'Wallet Recharge', href: '/wallet/recharge' },
    { icon: History, label: 'Wallet Transactions', href: '/wallet/transactions' },
    { icon: Gift, label: 'Monthly Offer', href: '/offers' },
    { icon: FileText, label: 'Terms & Conditions', href: '/terms' },
    { icon: UserSquare2, label: 'Employees', href: '/employees' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: HelpCircle, label: 'Contact Support', href: '/support' },
    { icon: Lock, label: 'Change Password', href: '/change-password' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();


    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-[#005c8a] text-white transition-transform duration-300",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col px-3 py-4">
                    {/* Header with close button for mobile */}
                    <div className="mb-10 flex items-center justify-between px-4">
                        <div className="w-full">
                            <h1 className="text-xl font-bold tracking-tight">N.S.D.</h1>
                            <p className="text-xs text-blue-200">Program of India</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-white hover:bg-white/10 rounded-lg p-1"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/10",
                                    pathname === item.href ? "bg-white/20 text-white font-medium shadow-sm" : "text-blue-50"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-white/10 pt-4">
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-200 hover:bg-red-500/10 hover:text-red-100 transition-all">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

