"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/center/layout/sidebar";
import { Header } from "@/components/center/layout/header";

interface UserData {
    name: string;
    email: string;
    role: string;
    joinedAt: string;
    centerName?: string;
    centerCode?: string;
    walletBalance?: number;
    address?: string;
    contact?: string;
}

interface Stats {
    total: number;
    active: number;
    completed: number;
}

interface MainLayoutProps {
    children: React.ReactNode;
    user?: UserData | null;
    stats?: Stats | null;
}

export function MainLayout({ children, user, stats }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header
                onMenuClick={() => setSidebarOpen(true)}
                userName={user?.name}
                joinedAt={user?.joinedAt}
                centerCode={user?.centerCode}
                walletBalance={user?.walletBalance}
                stats={stats}
            />
            <main className="pt-16 min-h-screen lg:pl-64 transition-all duration-300">
                <div className="p-4 sm:p-6 md:p-8">
                    {children}
                </div>
            </main>
        </>
    );
}
