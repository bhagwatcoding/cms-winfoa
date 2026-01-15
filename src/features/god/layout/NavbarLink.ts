import { LayoutDashboard, Users, Shield, Clock, Activity, Key, Building2, BookOpen, GraduationCap, DollarSign, Settings } from "lucide-react";

export const mainNavItems = [
    { title: "Dashboard", url: "/god", icon: LayoutDashboard },
    { title: "Users", url: "/god/users", icon: Users },
    { title: "Roles", url: "/god/roles", icon: Shield },
    { title: "Sessions", url: "/god/sessions", icon: Clock },
    { title: "Activity", url: "/god/activity", icon: Activity },
    { title: "API Keys", url: "/god/api-keys", icon: Key },
];

export const managementItems = [
    { title: "Centers", url: "/god/centers", icon: Building2 },
    { title: "Courses", url: "/god/courses", icon: BookOpen },
    { title: "Students", url: "/god/students", icon: GraduationCap },
    { title: "Transactions", url: "/god/transactions", icon: DollarSign },
];

export const systemItems = [
    { title: "Settings", url: "/god/settings", icon: Settings },
];