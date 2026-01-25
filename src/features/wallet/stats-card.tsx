'use client';

import { cn } from '@/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800',
    icon: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    border: 'border-slate-200/50 dark:border-slate-700/50',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/10',
    icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/50 dark:border-emerald-700/30',
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/10',
    icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/50 dark:border-amber-700/30',
  },
  danger: {
    bg: 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-900/20 dark:to-red-900/10',
    icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/50 dark:border-rose-700/30',
  },
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = 'default',
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  trend >= 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                )}
              >
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

// Stats row with multiple mini stats
interface MiniStatProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

interface StatsRowProps {
  stats: MiniStatProps[];
  className?: string;
}

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 rounded-xl border bg-card/50 p-4',
        className
      )}
    >
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-3">
          <stat.icon className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="font-semibold">{stat.value}</p>
          </div>
          {index < stats.length - 1 && <div className="h-8 w-px bg-border ml-4" />}
        </div>
      ))}
    </div>
  );
}
