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
                "group relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-lg border border-black/5 h-full min-h-[110px] sm:min-h-[140px] md:min-h-[160px]",
                color
            )}
        >
            <div className="mb-2 sm:mb-3 md:mb-4 rounded-full bg-white/20 p-2 sm:p-3 md:p-4 transition-transform group-hover:rotate-12 group-active:rotate-6">
                <Icon className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 text-black/80" />
            </div>
            <h3 className="text-center text-[10px] leading-tight sm:text-sm font-bold uppercase tracking-wider text-black/80 px-1">{label}</h3>
            {count !== undefined && (
                <span className="mt-1 sm:mt-2 text-lg sm:text-2xl font-black text-black/60">{count}</span>
            )}
        </Link>
    );
}
