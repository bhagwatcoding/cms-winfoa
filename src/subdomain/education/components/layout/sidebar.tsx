"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, Users, CreditCard, GraduationCap, Download, Award, Wallet, History, Gift, FileText, UserSquare2, Bell, HelpCircle, Lock, LogOut, X, Building2, BookOpen, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: UserPlus, label: 'New Admission', href: '/admission' },
    { icon: Users, label: 'Students', href: '/students' },
    { icon: ClipboardList, label: 'Registration List', href: '/students/registration-list' },
    { icon: BookOpen, label: 'Courses', href: '/courses' },
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
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white transition-transform duration-300 shadow-2xl",
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full flex-col px-3 py-4">
                    {/* Header with close button for mobile */}
                    <div className="mb-8 flex items-center justify-between px-4">
                        <div className="w-full flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                    N.S.D.
                                </h1>
                                <p className="text-xs text-blue-300/80 font-medium">Program of India</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
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
                                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 group",
                                    pathname === item.href
                                        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold shadow-lg shadow-blue-500/30 scale-[1.02]"
                                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    pathname === item.href ? "scale-110" : "group-hover:scale-110"
                                )} />
                                <span className="tracking-wide">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-slate-700/50 pt-4">
                        <form action={async () => {
                            await import('@/lib/actions/edu/auth').then(mod => mod.logoutAction());
                        }}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-all duration-200 group"
                            >
                                <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold tracking-wide">Logout</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    );
}
