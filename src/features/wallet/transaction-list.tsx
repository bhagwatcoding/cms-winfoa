'use client';

import { cn } from '@/utils';
import { Badge } from '@/ui';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Receipt,
  Banknote,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category?: 'transfer' | 'recharge' | 'withdrawal' | 'bill' | 'shopping' | 'other';
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date | string;
  metadata?: Record<string, unknown>;
}

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  showViewAll?: boolean;
  viewAllHref?: string;
  emptyMessage?: string;
  className?: string;
}

const categoryIcons: Record<string, LucideIcon> = {
  transfer: ArrowUpRight,
  recharge: CreditCard,
  withdrawal: Banknote,
  bill: Receipt,
  shopping: ShoppingBag,
};

export function TransactionList({
  transactions,
  loading = false,
  showViewAll = true,
  viewAllHref = '/wallet/history',
  emptyMessage = 'No transactions yet',
  className,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className={cn('rounded-2xl border bg-card', className)}>
        <div className="border-b p-4">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-2xl border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        {showViewAll && transactions.length > 0 && (
          <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
        )}
      </div>

      {/* Transactions */}
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <CreditCard className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.type === 'credit';
  const Icon =
    categoryIcons[transaction.category || 'other'] || (isCredit ? ArrowDownLeft : ArrowUpRight);

  const date =
    typeof transaction.createdAt === 'string'
      ? new Date(transaction.createdAt)
      : transaction.createdAt;

  const statusColors = {
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
      {/* Icon */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          isCredit
            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
            : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {date.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span>•</span>
          <span>
            {date.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Amount & Status */}
      <div className="text-right">
        <p
          className={cn(
            'font-bold',
            isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          )}
        >
          {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </p>
        <Badge
          variant="secondary"
          className={cn('text-xs capitalize', statusColors[transaction.status])}
        >
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}

// Single transaction display for detail pages
interface TransactionDetailCardProps {
  transaction: Transaction;
  className?: string;
}

export function TransactionDetailCard({ transaction, className }: TransactionDetailCardProps) {
  const isCredit = transaction.type === 'credit';
  const date =
    typeof transaction.createdAt === 'string'
      ? new Date(transaction.createdAt)
      : transaction.createdAt;

  return (
    <div className={cn('rounded-2xl border bg-card p-6 text-center', className)}>
      <div
        className={cn(
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
          isCredit ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
        )}
      >
        {isCredit ? <ArrowDownLeft className="h-8 w-8" /> : <ArrowUpRight className="h-8 w-8" />}
      </div>

      <p className={cn('text-3xl font-bold', isCredit ? 'text-emerald-600' : 'text-rose-600')}>
        {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
      </p>

      <p className="mt-2 font-medium">{transaction.description}</p>
      <p className="text-sm text-muted-foreground">
        {date.toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}{' '}
        at{' '}
        {date.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>

      <div className="mt-4 inline-block">
        <Badge
          variant={
            transaction.status === 'completed'
              ? 'default'
              : transaction.status === 'pending'
                ? 'secondary'
                : 'destructive'
          }
          className="capitalize"
        >
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}
