"use client";

import { DataTable, StatusBadge, type Column } from "@/features/god";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";
import {
    Key,
    Plus,
    Copy,
    Eye,
    EyeOff,
    MoreHorizontal,
    Clock,
    Activity,
    Shield,
} from "lucide-react";
import { useState } from "react";

// Mock API key data
interface ApiKey {
    id: string;
    name: string;
    key: string;
    permissions: string[];
    isActive: boolean;
    lastUsed?: string;
    expiresAt?: string;
    createdAt: string;
    requestCount: number;
}

const mockApiKeys: ApiKey[] = [
    {
        id: "1",
        name: "Production API",
        key: "pk_live_abc123xyz789",
        permissions: ["read", "write", "delete"],
        isActive: true,
        lastUsed: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        createdAt: "2024-01-01",
        requestCount: 124567,
    },
    {
        id: "2",
        name: "Mobile App Integration",
        key: "pk_live_mob456def012",
        permissions: ["read", "write"],
        isActive: true,
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: "2024-02-15",
        requestCount: 89432,
    },
    {
        id: "3",
        name: "Analytics Dashboard",
        key: "pk_live_ana789ghi345",
        permissions: ["read"],
        isActive: true,
        lastUsed: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdAt: "2024-03-10",
        requestCount: 45678,
    },
    {
        id: "4",
        name: "Legacy Integration",
        key: "pk_test_leg012jkl678",
        permissions: ["read"],
        isActive: false,
        expiresAt: "2024-01-01",
        createdAt: "2023-06-20",
        requestCount: 12345,
    },
    {
        id: "5",
        name: "Development Key",
        key: "pk_test_dev345mno901",
        permissions: ["read", "write", "delete"],
        isActive: true,
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: "2024-06-01",
        requestCount: 5678,
    },
];

const MaskedKey = ({ apiKey }: { apiKey: string }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 text-xs">
                {visible ? apiKey : `${apiKey.slice(0, 10)}${"•".repeat(12)}`}
            </code>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setVisible(!visible)}
            >
                {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => navigator.clipboard.writeText(apiKey)}
            >
                <Copy className="h-3 w-3" />
            </Button>
        </div>
    );
};

const columns: Column<ApiKey>[] = [
    {
        key: "name",
        header: "Name",
        render: (key) => (
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                    <Key className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-xs text-muted-foreground">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "key",
        header: "API Key",
        render: (key) => <MaskedKey apiKey={key.key} />,
    },
    {
        key: "permissions",
        header: "Permissions",
        render: (key) => (
            <div className="flex flex-wrap gap-1">
                {key.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs capitalize">
                        {perm}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        key: "requestCount",
        header: "Requests",
        render: (key) => (
            <div className="flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <span className="font-mono text-sm">
                    {key.requestCount.toLocaleString()}
                </span>
            </div>
        ),
    },
    {
        key: "isActive",
        header: "Status",
        render: (key) => (
            <StatusBadge status={key.isActive ? "active" : "inactive"} />
        ),
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

export default function ApiKeysPage() {
    const totalRequests = mockApiKeys.reduce((sum, k) => sum + k.requestCount, 0);
    const activeKeys = mockApiKeys.filter((k) => k.isActive).length;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Key className="h-6 w-6 text-primary" />
                        API Keys
                    </h1>
                    <p className="text-muted-foreground">
                        Manage API access tokens and monitor usage
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Generate New Key
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/5 border-blue-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Keys</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{mockApiKeys.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Active Keys</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                            {activeKeys}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 border-amber-500/20">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {totalRequests.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* API Keys Table */}
            <DataTable
                data={mockApiKeys}
                columns={columns}
                title="API Keys"
                description="All registered API keys and their permissions"
                searchPlaceholder="Search API keys..."
            />
        </div>
    );
}
