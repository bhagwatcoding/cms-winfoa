'use client';

import { cn } from '@/utils';
import { Wallet, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
  balance: number | null;
  loading?: boolean;
  currency?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function BalanceCard({
  balance,
  loading = false,
  currency = '₹',
  trend,
  trendLabel = 'vs last month',
  className,
}: BalanceCardProps) {
  const [visible, setVisible] = useState(true);

  const formatBalance = (amount: number) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} L`;
    }
    return amount.toLocaleString('en-IN');
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 md:p-8',
        'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700',
        'shadow-2xl shadow-purple-500/30',
        className
      )}
    >
      {/* Background decorations */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute right-4 top-4 opacity-10">
        <Wallet className="h-24 w-24 md:h-32 md:w-32" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-white/80">Total Balance</span>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            {visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>

        {/* Balance */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {loading ? (
              <span className="inline-block h-12 w-48 animate-pulse rounded-lg bg-white/20" />
            ) : visible ? (
              `${currency}${formatBalance(balance ?? 0)}`
            ) : (
              `${currency}${'•'.repeat(6)}`
            )}
          </h2>

          {trend !== undefined && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                  trend >= 0 ? 'bg-emerald-500/20 text-emerald-200' : 'bg-rose-500/20 text-rose-200'
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-white/60">{trendLabel}</span>
            </div>
          )}
        </div>

        {/* Card design elements */}
        <div className="flex items-end justify-between pt-4">
          <div className="space-y-1">
            <p className="text-xs text-white/50">Card Number</p>
            <p className="font-mono text-sm tracking-widest text-white/80">•••• •••• •••• 4242</p>
          </div>
          <div className="flex gap-1">
            <div className="h-8 w-8 rounded-full bg-red-500/80" />
            <div className="-ml-3 h-8 w-8 rounded-full bg-yellow-500/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
