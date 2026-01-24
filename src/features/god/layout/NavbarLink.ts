import { LayoutDashboard, Users, Shield, Clock, Activity, Key, Building2, BookOpen, GraduationCap, DollarSign, Settings } from "lucide-react";

export const mainNavItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Users", url: "/users", icon: Users },
    { title: "Roles", url: "/roles", icon: Shield },
    { title: "Sessions", url: "/sessions", icon: Clock },
    { title: "Activity", url: "/activity", icon: Activity },
    { title: "API Keys", url: "/api-keys", icon: Key },
];

export const managementItems = [
    { title: "Centers", url: "/centers", icon: Building2 },
    { title: "Courses", url: "/courses", icon: BookOpen },
    { title: "Students", url: "/students", icon: GraduationCap },
    { title: "Transactions", url: "/transactions", icon: DollarSign },
];

export const systemItems = [
    { title: "Settings", url: "/settings", icon: Settings },
];