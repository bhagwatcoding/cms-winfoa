"use client";

import { cn } from "@/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: LucideIcon;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
    className?: string;
}

const variantStyles = {
    default: "from-slate-500/20 to-slate-600/10 border-slate-500/30",
    primary: "from-blue-500/20 to-indigo-600/10 border-blue-500/30",
    success: "from-emerald-500/20 to-green-600/10 border-emerald-500/30",
    warning: "from-amber-500/20 to-orange-600/10 border-amber-500/30",
    danger: "from-rose-500/20 to-red-600/10 border-rose-500/30",
};

const iconStyles = {
    default: "bg-slate-500/20 text-slate-400",
    primary: "bg-blue-500/20 text-blue-400",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-amber-500/20 text-amber-400",
    danger: "bg-rose-500/20 text-rose-400",
};

export function StatsCard({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    variant = "default",
    className,
}: StatsCardProps) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border bg-gradient-to-br p-6",
                "backdrop-blur-sm transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-lg hover:shadow-black/10",
                "dark:bg-card/50",
                variantStyles[variant],
                className
            )}
        >
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl" />

            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>

                    {change !== undefined && (
                        <div className="flex items-center gap-1.5">
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                    isPositive && "bg-emerald-500/10 text-emerald-500",
                                    isNegative && "bg-rose-500/10 text-rose-500",
                                    !isPositive && !isNegative && "bg-slate-500/10 text-slate-500"
                                )}
                            >
                                {isPositive && "↑"}
                                {isNegative && "↓"}
                                {Math.abs(change)}%
                            </span>
                            {changeLabel && (
                                <span className="text-xs text-muted-foreground">{changeLabel}</span>
                            )}
                        </div>
                    )}
                </div>

                <div className={cn("rounded-xl p-3", iconStyles[variant])}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
