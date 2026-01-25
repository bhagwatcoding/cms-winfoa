'use client';

import { cn } from '@/utils';
import { Badge } from '@/ui';
import { ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface EntityCardProps {
  title: string;
  description?: string;
  count?: number;
  icon: LucideIcon;
  href: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  variant?: 'default' | 'primary' | 'emerald' | 'amber' | 'rose' | 'violet';
  className?: string;
}

const variantStyles = {
  default: {
    gradient: 'from-slate-500/10 to-slate-600/5',
    iconBg: 'bg-slate-500/20',
    iconColor: 'text-slate-400',
    border: 'border-slate-500/20',
    hover: 'hover:border-slate-500/40',
  },
  primary: {
    gradient: 'from-blue-500/10 to-indigo-600/5',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-500/40',
  },
  emerald: {
    gradient: 'from-emerald-500/10 to-green-600/5',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    border: 'border-emerald-500/20',
    hover: 'hover:border-emerald-500/40',
  },
  amber: {
    gradient: 'from-amber-500/10 to-orange-600/5',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    border: 'border-amber-500/20',
    hover: 'hover:border-amber-500/40',
  },
  rose: {
    gradient: 'from-rose-500/10 to-red-600/5',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-400',
    border: 'border-rose-500/20',
    hover: 'hover:border-rose-500/40',
  },
  violet: {
    gradient: 'from-violet-500/10 to-purple-600/5',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    border: 'border-violet-500/20',
    hover: 'hover:border-violet-500/40',
  },
};

export function EntityCard({
  title,
  description,
  count,
  icon: Icon,
  href,
  badge,
  badgeVariant,
  variant = 'default',
  className,
}: EntityCardProps) {
  const styles = variantStyles[variant];

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border',
        'bg-gradient-to-br p-5 backdrop-blur-sm',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5',
        styles.gradient,
        styles.border,
        styles.hover,
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl transition-transform group-hover:scale-110" />

      <div className="flex items-start justify-between">
        <div className={cn('rounded-xl p-3', styles.iconBg)}>
          <Icon className={cn('h-6 w-6', styles.iconColor)} />
        </div>

        {badge && (
          <Badge variant={badgeVariant ?? 'secondary'} className="text-xs">
            {badge}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="text-lg font-semibold">{title}</h4>
          {count !== undefined && (
            <span className="text-2xl font-bold text-muted-foreground">
              {count.toLocaleString()}
            </span>
          )}
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        Manage
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

// Simple entity list for sidebar or narrow spaces
interface EntityListItemProps {
  title: string;
  count?: number;
  icon: LucideIcon;
  href: string;
  isActive?: boolean;
}

export function EntityListItem({ title, count, icon: Icon, href, isActive }: EntityListItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-sm font-medium">{title}</span>
      {count !== undefined && (
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      )}
    </Link>
  );
}
