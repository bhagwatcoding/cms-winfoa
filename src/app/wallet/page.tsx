"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWalletBalance, getRecentTransactions } from "./actions";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Wallet,
  Clock,
  CreditCard,
} from "lucide-react";

export default function WalletDashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const balanceData = await getWalletBalance();
      const txData = await getRecentTransactions();

      if (balanceData && !balanceData.error) {
        setBalance(balanceData.balance);
      }
      if (txData && !txData.error) {
        setTransactions(txData.transactions || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Welcome back, manage your finances securely.
        </p>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-3xl p-8 shadow-2xl shadow-indigo-500/30">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Wallet size={120} />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
            <div>
              <p className="text-indigo-100 font-medium mb-1">Total Balance</p>
              <h3 className="text-5xl font-bold tracking-tight">
                {loading ? "..." : `₹${balance?.toLocaleString("en-IN")}`}
              </h3>
            </div>
            <div className="flex gap-3">
              <Link href="/wallet/recharge">
                <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg">
                  <Plus size={20} />
                  Add Money
                </button>
              </Link>
              <Link href="/wallet/history">
                <button className="bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-500/40 transition-colors flex items-center gap-2">
                  <HistoryIcon />
                  History
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn
                icon={<CreditCard className="text-pink-500" />}
                label="Pay Bills"
                color="bg-pink-50 dark:bg-pink-900/20"
                href="/wallet/bills"
              />
              <ActionBtn
                icon={<ArrowUpRight className="text-emerald-500" />}
                label="Transfer"
                color="bg-emerald-50 dark:bg-emerald-900/20"
                href="/wallet/transfer"
              />
              <ActionBtn
                icon={<Clock className="text-orange-500" />}
                label="Withdraw"
                color="bg-orange-50 dark:bg-orange-900/20"
                href="/wallet/withdraw"
              />
              <ActionBtn
                icon={<Wallet className="text-blue-500" />}
                label="Cards"
                color="bg-blue-50 dark:bg-blue-900/20"
                href="/wallet"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <Link
            href="/wallet/history"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading activity...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No recent transactions.
            </div>
          ) : (
            transactions.map((tx: any) => (
              <div
                key={tx._id?.toString() || Math.random().toString()}
                className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      tx.type === "credit"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                        : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {tx.description || "Transaction"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString()
                        : "Unknown date"}{" "}
                      •{" "}
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleTimeString()
                        : "Unknown time"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      tx.type === "credit"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹
                    {tx.amount ? tx.amount.toLocaleString("en-IN") : "0"}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {tx.status || "pending"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${color} p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200`}
    >
      {icon}
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
    </Link>
  );
}

function HistoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
    </svg>
  );
}
