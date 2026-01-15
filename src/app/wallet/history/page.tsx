"use client";

import { useEffect, useState } from "react";
import { getRecentTransactions } from "../actions";
import {
    TransactionList,
    StatsCard,
    type Transaction,
} from "@/features/wallet";
import { Button, Input } from "@/ui";
import {
    ArrowLeft,
    Search,
    Filter,
    TrendingUp,
    TrendingDown,
    Clock,
    Download,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

type FilterType = "all" | "credit" | "debit";
type TimeFilter = "all" | "today" | "week" | "month";

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<FilterType>("all");
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

    useEffect(() => {
        async function loadData() {
            const txData = await getRecentTransactions(100); // Fetch more for history

            if (txData && !txData.error) {
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

    // Apply filters
    const filteredTransactions = transactions.filter((tx) => {
        // Type filter
        if (typeFilter !== "all" && tx.type !== typeFilter) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!tx.description.toLowerCase().includes(query)) return false;
        }

        // Time filter
        if (timeFilter !== "all") {
            const txDate = new Date(tx.createdAt);
            const now = new Date();

            if (timeFilter === "today") {
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (txDate < today) return false;
            } else if (timeFilter === "week") {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (txDate < weekAgo) return false;
            } else if (timeFilter === "month") {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                if (txDate < monthAgo) return false;
            }
        }

        return true;
    });

    // Stats
    const totalCredit = transactions
        .filter((tx) => tx.type === "credit")
        .reduce((sum, tx) => sum + tx.amount, 0);

    const totalDebit = transactions
        .filter((tx) => tx.type === "debit")
        .reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/wallet">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">Transaction History</h1>
                        <p className="text-sm text-muted-foreground">
                            View all your past transactions
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatsCard
                    title="Total Received"
                    value={`₹${totalCredit.toLocaleString("en-IN")}`}
                    icon={TrendingUp}
                    variant="success"
                />
                <StatsCard
                    title="Total Spent"
                    value={`₹${totalDebit.toLocaleString("en-IN")}`}
                    icon={TrendingDown}
                    variant="danger"
                />
                <StatsCard
                    title="Transactions"
                    value={transactions.length}
                    icon={Clock}
                    variant="default"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                    {(["all", "credit", "debit"] as FilterType[]).map((filter) => (
                        <Button
                            key={filter}
                            variant={typeFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTypeFilter(filter)}
                            className="capitalize"
                        >
                            {filter === "all" ? "All" : filter === "credit" ? "Received" : "Spent"}
                        </Button>
                    ))}
                </div>

                {/* Time Filter */}
                <div className="flex gap-2">
                    {(["all", "today", "week", "month"] as TimeFilter[]).map((filter) => (
                        <Button
                            key={filter}
                            variant={timeFilter === filter ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setTimeFilter(filter)}
                            className="capitalize"
                        >
                            {filter === "all" ? "All Time" : filter}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Transactions List */}
            <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                showViewAll={false}
                emptyMessage={
                    searchQuery || typeFilter !== "all" || timeFilter !== "all"
                        ? "No transactions match your filters"
                        : "No transactions yet"
                }
            />
        </div>
    );
}
