"use client";

import { cn } from "@/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface QuickAction {
    id: string;
    label: string;
    description?: string;
    icon: LucideIcon;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "primary" | "success" | "warning" | "danger";
}

interface QuickActionsProps {
    actions: QuickAction[];
    title?: string;
    columns?: 2 | 3 | 4;
    className?: string;
}

const variantStyles = {
    default: {
        bg: "bg-slate-500/10 hover:bg-slate-500/20",
        icon: "text-slate-400",
        border: "border-slate-500/20",
    },
    primary: {
        bg: "bg-blue-500/10 hover:bg-blue-500/20",
        icon: "text-blue-400",
        border: "border-blue-500/20",
    },
    success: {
        bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
        icon: "text-emerald-400",
        border: "border-emerald-500/20",
    },
    warning: {
        bg: "bg-amber-500/10 hover:bg-amber-500/20",
        icon: "text-amber-400",
        border: "border-amber-500/20",
    },
    danger: {
        bg: "bg-rose-500/10 hover:bg-rose-500/20",
        icon: "text-rose-400",
        border: "border-rose-500/20",
    },
};

export function QuickActions({
    actions,
    title = "Quick Actions",
    columns = 4,
    className,
}: QuickActionsProps) {
    const gridCols = {
        2: "grid-cols-2",
        3: "grid-cols-2 sm:grid-cols-3",
        4: "grid-cols-2 sm:grid-cols-4",
    };

    return (
        <div className={cn("space-y-4", className)}>
            {title && (
                <h3 className="text-lg font-semibold">{title}</h3>
            )}

            <div className={cn("grid gap-3", gridCols[columns])}>
                {actions.map((action) => (
                    <QuickActionItem key={action.id} action={action} />
                ))}
            </div>
        </div>
    );
}

function QuickActionItem({ action }: { action: QuickAction }) {
    const variant = action.variant ?? "default";
    const styles = variantStyles[variant];
    const Icon = action.icon;

    const content = (
        <div
            className={cn(
                "group relative flex flex-col items-center gap-3 rounded-xl border p-4",
                "transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-md",
                styles.bg,
                styles.border
            )}
        >
            <div
                className={cn(
                    "rounded-xl p-3 transition-transform group-hover:scale-110",
                    styles.bg
                )}
            >
                <Icon className={cn("h-6 w-6", styles.icon)} />
            </div>

            <div className="text-center">
                <p className="font-medium">{action.label}</p>
                {action.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {action.description}
                    </p>
                )}
            </div>
        </div>
    );

    if (action.href) {
        return (
            <Link href={action.href} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl">
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={action.onClick}
            className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl text-left"
        >
            {content}
        </button>
    );
}
