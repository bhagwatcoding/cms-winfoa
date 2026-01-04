"use client";

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
    label: string;
    icon: LucideIcon;
    href: string;
    color: string;
    count?: string | number;
}

export function DashboardCard({ label, icon: Icon, href, color, count }: DashboardCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl p-6 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md h-full min-h-[160px]",
                color
            )}
        >
            <div className="mb-4 rounded-full bg-white/20 p-4 transition-transform group-hover:rotate-12">
                <Icon className="h-8 w-8 text-black/80" />
            </div>
            <h3 className="text-center text-sm font-bold uppercase tracking-wider text-black/80">{label}</h3>
            {count !== undefined && (
                <span className="mt-2 text-2xl font-black text-black/60">{count}</span>
            )}
        </Link>
    );
}
