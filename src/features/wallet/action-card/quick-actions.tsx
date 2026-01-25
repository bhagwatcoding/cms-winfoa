'use client';

import { cn } from '@/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface QuickActionItem {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  color: 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'amber';
}

interface QuickActionsGridProps {
  actions: QuickActionItem[];
  className?: string;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconBg: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:bg-blue-500/20 dark:hover:bg-blue-500/30',
  },
  green: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconBg: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30',
  },
  orange: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    iconBg: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    hover: 'hover:bg-orange-500/20 dark:hover:bg-orange-500/30',
  },
  pink: {
    bg: 'bg-pink-500/10 dark:bg-pink-500/20',
    iconBg: 'bg-pink-500',
    text: 'text-pink-600 dark:text-pink-400',
    hover: 'hover:bg-pink-500/20 dark:hover:bg-pink-500/30',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconBg: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:bg-purple-500/20 dark:hover:bg-purple-500/30',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconBg: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:bg-amber-500/20 dark:hover:bg-amber-500/30',
  },
};

export function QuickActionsGrid({ actions, className }: QuickActionsGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4', className)}>
      {actions.map((action) => (
        <QuickActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}

function QuickActionCard({ action }: { action: QuickActionItem }) {
  const styles = colorStyles[action.color];
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      className={cn(
        'group relative flex flex-col items-center gap-3 rounded-2xl border border-transparent p-4',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:border-white/10 hover:shadow-lg',
        styles.bg,
        styles.hover
      )}
    >
      <div
        className={cn(
          'rounded-xl p-3 text-white shadow-lg transition-transform group-hover:scale-110',
          styles.iconBg
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-center">
        <p className={cn('font-semibold', styles.text)}>{action.label}</p>
        {action.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
        )}
      </div>
    </Link>
  );
}

// Large action button for prominent CTAs
interface LargeActionButtonProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  href: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function LargeActionButton({
  icon: Icon,
  label,
  description,
  href,
  variant = 'primary',
  className,
}: LargeActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300',
        variant === 'primary'
          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
          : 'border bg-card/50 hover:bg-card hover:shadow-lg',
        className
      )}
    >
      <div
        className={cn('rounded-xl p-3', variant === 'primary' ? 'bg-white/20' : 'bg-primary/10')}
      >
        <Icon
          className={cn(
            'h-6 w-6 transition-transform group-hover:scale-110',
            variant === 'primary' ? 'text-white' : 'text-primary'
          )}
        />
      </div>
      <div className="flex-1">
        <p
          className={cn('font-semibold', variant === 'primary' ? 'text-white' : 'text-foreground')}
        >
          {label}
        </p>
        {description && (
          <p
            className={cn(
              'text-sm',
              variant === 'primary' ? 'text-white/70' : 'text-muted-foreground'
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div
        className={cn(
          'rounded-full p-2 transition-transform group-hover:translate-x-1',
          variant === 'primary' ? 'bg-white/10' : 'bg-muted'
        )}
      >
        <svg
          className={cn('h-4 w-4', variant === 'primary' ? 'text-white' : 'text-muted-foreground')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
