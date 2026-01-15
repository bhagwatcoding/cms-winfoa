"use client";

import { DataTable, StatusBadge, type Column } from "@/features/god";
import { Badge, Button } from "@/ui";
import {
    Monitor,
    Smartphone,
    Laptop,
    Globe,
    Clock,
    MapPin,
    LogOut,
    XCircle,
} from "lucide-react";

// Mock session data
interface Session {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    device: "desktop" | "mobile" | "tablet";
    browser: string;
    os: string;
    ipAddress: string;
    location: string;
    createdAt: string;
    lastActive: string;
    status: "active" | "idle" | "expired";
}

const mockSessions: Session[] = [
    {
        id: "1",
        userId: "u1",
        userName: "John Doe",
        userEmail: "john@example.com",
        device: "desktop",
        browser: "Chrome 120",
        os: "Windows 11",
        ipAddress: "192.168.1.100",
        location: "Mumbai, India",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: "active",
    },
    {
        id: "2",
        userId: "u2",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        device: "mobile",
        browser: "Safari 17",
        os: "iOS 17",
        ipAddress: "192.168.1.101",
        location: "Delhi, India",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: "idle",
    },
    {
        id: "3",
        userId: "u3",
        userName: "Mike Johnson",
        userEmail: "mike@example.com",
        device: "desktop",
        browser: "Firefox 121",
        os: "macOS Sonoma",
        ipAddress: "192.168.1.102",
        location: "Bangalore, India",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "active",
    },
    {
        id: "4",
        userId: "u1",
        userName: "John Doe",
        userEmail: "john@example.com",
        device: "mobile",
        browser: "Chrome Mobile",
        os: "Android 14",
        ipAddress: "192.168.1.103",
        location: "Mumbai, India",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "expired",
    },
    {
        id: "5",
        userId: "u4",
        userName: "Sarah Wilson",
        userEmail: "sarah@example.com",
        device: "tablet",
        browser: "Safari 17",
        os: "iPadOS 17",
        ipAddress: "192.168.1.104",
        location: "Chennai, India",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: "active",
    },
];

const DeviceIcon = ({ device }: { device: Session["device"] }) => {
    switch (device) {
        case "mobile":
            return <Smartphone className="h-4 w-4" />;
        case "tablet":
            return <Laptop className="h-4 w-4" />;
        default:
            return <Monitor className="h-4 w-4" />;
    }
};

const columns: Column<Session>[] = [
    {
        key: "userName",
        header: "User",
        render: (session) => (
            <div>
                <p className="font-medium">{session.userName}</p>
                <p className="text-xs text-muted-foreground">{session.userEmail}</p>
            </div>
        ),
    },
    {
        key: "device",
        header: "Device",
        render: (session) => (
            <div className="flex items-center gap-2">
                <div className="rounded-lg bg-muted p-2">
                    <DeviceIcon device={session.device} />
                </div>
                <div>
                    <p className="text-sm">{session.browser}</p>
                    <p className="text-xs text-muted-foreground">{session.os}</p>
                </div>
            </div>
        ),
    },
    {
        key: "location",
        header: "Location",
        render: (session) => (
            <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                    <p>{session.location}</p>
                    <p className="text-xs text-muted-foreground">{session.ipAddress}</p>
                </div>
            </div>
        ),
    },
    {
        key: "lastActive",
        header: "Last Active",
        render: (session) => {
            const lastActive = new Date(session.lastActive);
            const now = new Date();
            const diffMs = now.getTime() - lastActive.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

            let timeStr = "";
            if (diffMins < 60) {
                timeStr = `${diffMins}m ago`;
            } else if (diffHours < 24) {
                timeStr = `${diffHours}h ago`;
            } else {
                timeStr = lastActive.toLocaleDateString();
            }

            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {timeStr}
                </div>
            );
        },
    },
    {
        key: "status",
        header: "Status",
        render: (session) => <StatusBadge status={session.status} />,
    },
    {
        key: "actions",
        header: "",
        className: "w-24",
        render: (session) => (
            <Button
                variant={session.status === "expired" ? "ghost" : "destructive"}
                size="sm"
                disabled={session.status === "expired"}
                className="gap-1"
            >
                <XCircle className="h-3 w-3" />
                Revoke
            </Button>
        ),
    },
];

export default function SessionsPage() {
    const activeSessions = mockSessions.filter((s) => s.status === "active").length;
    const idleSessions = mockSessions.filter((s) => s.status === "idle").length;
    const expiredSessions = mockSessions.filter((s) => s.status === "expired").length;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Globe className="h-6 w-6 text-primary" />
                        Active Sessions
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor and manage user sessions across all devices
                    </p>
                </div>
                <Button variant="destructive" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Revoke All Sessions
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-emerald-500/10 border-emerald-500/30 p-4">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Active
                    </p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {activeSessions}
                    </p>
                </div>
                <div className="rounded-lg border bg-amber-500/10 border-amber-500/30 p-4">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        Idle
                    </p>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {idleSessions}
                    </p>
                </div>
                <div className="rounded-lg border bg-slate-500/10 border-slate-500/30 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Expired</p>
                    <p className="text-3xl font-bold text-muted-foreground">
                        {expiredSessions}
                    </p>
                </div>
            </div>

            {/* Sessions Table */}
            <DataTable
                data={mockSessions}
                columns={columns}
                title="All Sessions"
                description="View and manage active user sessions"
                searchPlaceholder="Search by user, device, or location..."
            />
        </div>
    );
}
