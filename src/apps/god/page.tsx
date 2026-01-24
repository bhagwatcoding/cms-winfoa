"use client";

import {
    StatsCard,
    AnalyticsChart,
    ActivityFeed,
    QuickActions,
    EntityCard,
    type ActivityItem,
    type QuickAction,
} from "@/features/god";
import {
    Users,
    Shield,
    Key,
    Activity,
    Building2,
    GraduationCap,
    BookOpen,
    DollarSign,
    UserPlus,
    Settings,
    FileText,
    Bell,
    LayoutDashboard,
    Clock,
} from "lucide-react";

// Mock data for demonstration
const statsData = [
    {
        title: "Total Users",
        value: "12,847",
        change: 12.5,
        changeLabel: "vs last month",
        icon: Users,
        variant: "primary" as const,
    },
    {
        title: "Active Sessions",
        value: "1,284",
        change: 8.2,
        changeLabel: "currently active",
        icon: Activity,
        variant: "success" as const,
    },
    {
        title: "API Calls Today",
        value: "48.2K",
        change: -3.1,
        changeLabel: "vs yesterday",
        icon: Key,
        variant: "warning" as const,
    },
    {
        title: "Revenue",
        value: "₹4.2L",
        change: 24.8,
        changeLabel: "this month",
        icon: DollarSign,
        variant: "success" as const,
    },
];

const quickActions: QuickAction[] = [
    {
        id: "add-user",
        label: "Add User",
        description: "Create new user",
        icon: UserPlus,
        href: "/users?action=create",
        variant: "primary",
    },
    {
        id: "manage-roles",
        label: "Manage Roles",
        description: "Edit permissions",
        icon: Shield,
        href: "/roles",
        variant: "warning",
    },
    {
        id: "view-logs",
        label: "Activity Logs",
        description: "View all activity",
        icon: FileText,
        href: "/activity",
        variant: "default",
    },
    {
        id: "settings",
        label: "Settings",
        description: "System config",
        icon: Settings,
        href: "/settings",
        variant: "default",
    },
];

const recentActivities: ActivityItem[] = [
    {
        id: "1",
        type: "login",
        user: { name: "John Doe", avatar: "" },
        action: "logged in from",
        target: "Chrome on Windows",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
        id: "2",
        type: "create",
        user: { name: "Admin" },
        action: "created new user",
        target: "jane.smith@example.com",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
        id: "3",
        type: "permission",
        user: { name: "System" },
        action: "updated role permissions for",
        target: "Staff",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
        id: "4",
        type: "update",
        user: { name: "Jane Smith" },
        action: "modified course",
        target: "Web Development Basics",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: "5",
        type: "delete",
        user: { name: "Admin" },
        action: "revoked API key for",
        target: "Legacy Integration",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
];

const userGrowthData = [
    { label: "Jan", value: 8420 },
    { label: "Feb", value: 9100 },
    { label: "Mar", value: 9800 },
    { label: "Apr", value: 10200 },
    { label: "May", value: 11100 },
    { label: "Jun", value: 11800 },
    { label: "Jul", value: 12847 },
];

const activityData = [
    { label: "Mon", value: 2400 },
    { label: "Tue", value: 3200 },
    { label: "Wed", value: 2800 },
    { label: "Thu", value: 4100 },
    { label: "Fri", value: 3600 },
    { label: "Sat", value: 1900 },
    { label: "Sun", value: 1200 },
];

const entityCards = [
    {
        title: "Users",
        description: "Manage all user accounts",
        count: 12847,
        icon: Users,
        href: "/users",
        variant: "primary" as const,
    },
    {
        title: "Roles",
        description: "Configure roles & permissions",
        count: 6,
        icon: Shield,
        href: "/roles",
        variant: "violet" as const,
    },
    {
        title: "Sessions",
        description: "Active user sessions",
        count: 1284,
        icon: Clock,
        href: "/sessions",
        badge: "Live",
        variant: "emerald" as const,
    },
    {
        title: "API Keys",
        description: "Manage API access tokens",
        count: 24,
        icon: Key,
        href: "/api-keys",
        variant: "amber" as const,
    },
    {
        title: "Centers",
        description: "Training center locations",
        count: 156,
        icon: Building2,
        href: "/centers",
        variant: "primary" as const,
    },
    {
        title: "Courses",
        description: "Course catalog management",
        count: 48,
        icon: BookOpen,
        href: "/courses",
        variant: "emerald" as const,
    },
    {
        title: "Students",
        description: "Student records",
        count: 8432,
        icon: GraduationCap,
        href: "/students",
        variant: "violet" as const,
    },
    {
        title: "Transactions",
        description: "Financial records",
        count: 2847,
        icon: DollarSign,
        href: "/transactions",
        variant: "amber" as const,
    },
];

export default function GodHomePage() {
    const now = new Date();
    const greeting =
        now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        God Portal
                    </h1>
                    <p className="text-muted-foreground">
                        <span suppressHydrationWarning>{greeting}</span>, <span className="font-medium text-foreground">Super Admin</span> • {" "}
                        <span suppressHydrationWarning>
                            {now.toLocaleDateString("en-IN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statsData.map((stat) => (
                    <StatsCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <QuickActions actions={quickActions} />

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <AnalyticsChart
                    data={userGrowthData}
                    title="User Growth"
                    type="line"
                    color="hsl(217, 91%, 60%)"
                    height={240}
                />
                <AnalyticsChart
                    data={activityData}
                    title="Weekly Activity"
                    type="bar"
                    color="hsl(160, 60%, 45%)"
                    height={240}
                />
            </div>

            {/* Entity Cards + Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h3 className="mb-4 text-lg font-semibold">Manage Entities</h3>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {entityCards.map((entity) => (
                            <EntityCard key={entity.title} {...entity} />
                        ))}
                    </div>
                </div>

                <div>
                    <ActivityFeed
                        activities={recentActivities}
                        maxItems={5}
                        onViewAll={() => console.log("View all activity")}
                    />
                </div>
            </div>
        </div>
    );
}