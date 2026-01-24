"use client";

import { DataTable, StatusBadge, type Column } from "@/features/god";
import { Badge, Button } from "@/ui";
import {
    DollarSign,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
    User,
    Building2,
    Calendar,
    MoreHorizontal,
} from "lucide-react";

// Mock transaction data
interface Transaction {
    id: string;
    type: "credit" | "debit";
    amount: number;
    status: string;
    description: string;
    userName: string;
    centerName?: string;
    reference?: string;
    createdAt: string;
}

const mockTransactions: Transaction[] = [
    {
        id: "TXN001",
        type: "credit",
        amount: 15000,
        status: "completed",
        description: "Course enrollment fee",
        userName: "Rahul Kumar",
        centerName: "Delhi Central",
        reference: "ENR-2024-001",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "TXN002",
        type: "credit",
        amount: 25000,
        status: "completed",
        description: "Course enrollment fee",
        userName: "Priya Sharma",
        centerName: "Mumbai South",
        reference: "ENR-2024-002",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "TXN003",
        type: "debit",
        amount: 8500,
        status: "completed",
        description: "Refund - Course cancellation",
        userName: "Amit Singh",
        centerName: "Bangalore Tech Hub",
        reference: "REF-2024-001",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "TXN004",
        type: "credit",
        amount: 12000,
        status: "pending",
        description: "Payment for certificate",
        userName: "Neha Gupta",
        centerName: "Chennai Central",
        reference: "CERT-2024-001",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "TXN005",
        type: "credit",
        amount: 18000,
        status: "failed",
        description: "Course enrollment fee",
        userName: "Vikram Patel",
        reference: "ENR-2024-003",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const columns: Column<Transaction>[] = [
    {
        key: "id",
        header: "Transaction",
        render: (txn) => (
            <div className="flex items-center gap-3">
                <div
                    className={`rounded-lg p-2 ${txn.type === "credit"
                            ? "bg-emerald-500/10"
                            : "bg-rose-500/10"
                        }`}
                >
                    {txn.type === "credit" ? (
                        <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <ArrowUpRight className="h-4 w-4 text-rose-500" />
                    )}
                </div>
                <div>
                    <p className="font-mono text-sm font-medium">{txn.id}</p>
                    <p className="text-xs text-muted-foreground">{txn.description}</p>
                </div>
            </div>
        ),
    },
    {
        key: "amount",
        header: "Amount",
        render: (txn) => (
            <div
                className={`flex items-center gap-0.5 font-medium ${txn.type === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
            >
                {txn.type === "credit" ? "+" : "-"}
                <IndianRupee className="h-3 w-3" />
                {txn.amount.toLocaleString()}
            </div>
        ),
    },
    {
        key: "userName",
        header: "User",
        render: (txn) => (
            <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{txn.userName}</span>
            </div>
        ),
    },
    {
        key: "centerName",
        header: "Center",
        render: (txn) =>
            txn.centerName ? (
                <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{txn.centerName}</span>
                </div>
            ) : (
                <span className="text-muted-foreground">-</span>
            ),
    },
    {
        key: "createdAt",
        header: "Date",
        render: (txn) => (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </div>
        ),
    },
    {
        key: "status",
        header: "Status",
        render: (txn) => <StatusBadge status={txn.status} />,
    },
    {
        key: "actions",
        header: "",
        className: "w-12",
        render: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        ),
    },
];

export default function TransactionsPage() {
    const totalCredits = mockTransactions
        .filter((t) => t.type === "credit" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalDebits = mockTransactions
        .filter((t) => t.type === "debit" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = mockTransactions
        .filter((t) => t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <DollarSign className="h-6 w-6 text-primary" />
                        Transactions
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all financial transactions
                    </p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20 p-4">
                    <p className="text-sm text-muted-foreground">Total Credits</p>
                    <p className="flex items-center gap-0.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        <IndianRupee className="h-5 w-5" />
                        {totalCredits.toLocaleString()}
                    </p>
                </div>
                <div className="rounded-lg border bg-gradient-to-br from-rose-500/10 to-red-600/5 border-rose-500/20 p-4">
                    <p className="text-sm text-muted-foreground">Total Debits</p>
                    <p className="flex items-center gap-0.5 text-2xl font-bold text-rose-600 dark:text-rose-400">
                        <IndianRupee className="h-5 w-5" />
                        {totalDebits.toLocaleString()}
                    </p>
                </div>
                <div className="rounded-lg border bg-gradient-to-br from-blue-500/10 to-indigo-600/5 border-blue-500/20 p-4">
                    <p className="text-sm text-muted-foreground">Net Revenue</p>
                    <p className="flex items-center gap-0.5 text-2xl font-bold">
                        <IndianRupee className="h-5 w-5" />
                        {(totalCredits - totalDebits).toLocaleString()}
                    </p>
                </div>
                <div className="rounded-lg border bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-amber-500/20 p-4">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="flex items-center gap-0.5 text-2xl font-bold text-amber-600 dark:text-amber-400">
                        <IndianRupee className="h-5 w-5" />
                        {pendingAmount.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <DataTable
                data={mockTransactions}
                columns={columns}
                title="Transaction History"
                description="All financial transactions"
                searchPlaceholder="Search transactions..."
            />
        </div>
    );
}
