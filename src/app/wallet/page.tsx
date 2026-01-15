"use client";

import { useEffect, useState } from "react";
import { getWalletBalance, getRecentTransactions } from "./actions";
import {
  BalanceCard,
  TransactionList,
  LargeActionButton,
  StatsCard,
  type Transaction,
} from "@/features/wallet";
import {
  Plus,
  Send,
  Receipt,
  Banknote,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Clock,
} from "lucide-react";



export default function WalletDashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const balanceData = await getWalletBalance();
      const txData = await getRecentTransactions();

      if (balanceData && !balanceData.error) {
        setBalance(balanceData.balance ?? 0);
      }
      if (txData && !txData.error) {
        // Transform transactions to match our interface
        const formattedTx = (txData.transactions || []).map((tx: any) => ({
          id: tx._id?.toString() || Math.random().toString(),
          type: tx.type as "credit" | "debit",
          amount: tx.amount || 0,
          description: tx.description || "Transaction",
          category: tx.metadata?.type || "other",
          status: tx.status || "completed",
          createdAt: tx.createdAt,
        }));
        setTransactions(formattedTx);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Mock stats - in real app, calculate from transactions
  const monthlySpent = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyReceived = transactions
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Manage your finances securely.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Balance Card - Spans 2 columns */}
        <div className="lg:col-span-2">
          <BalanceCard
            balance={balance}
            loading={loading}
            trend={12.5}
            trendLabel="vs last month"
          />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <StatsCard
            title="Money Out"
            value={`₹${monthlySpent.toLocaleString("en-IN")}`}
            icon={TrendingDown}
            variant="danger"
          />
          <StatsCard
            title="Money In"
            value={`₹${monthlyReceived.toLocaleString("en-IN")}`}
            icon={TrendingUp}
            variant="success"
          />
        </div>
      </div>



      {/* Large Action Buttons */}
      <div className="grid gap-4 sm:grid-cols-2">
        <LargeActionButton
          icon={Plus}
          label="Add Money"
          description="Top up your wallet balance instantly"
          href="/wallet/recharge"
          variant="primary"
        />
        <LargeActionButton
          icon={Clock}
          label="Transaction History"
          description="View all your past transactions"
          href="/wallet/history"
          variant="secondary"
        />
      </div>

      {/* Recent Transactions */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        showViewAll
        viewAllHref="/wallet/history"
        emptyMessage="No transactions yet. Start by adding money to your wallet!"
      />
    </div>
  );
}
