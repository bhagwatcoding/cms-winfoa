"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Switch } from "@/ui";
import {
    Shield,
    Plus,
    MoreHorizontal,
    Check,
    X,
    ChevronDown,
    ChevronRight,
    Users,
} from "lucide-react";
import { useState } from "react";

// Mock roles data
interface Role {
    id: string;
    name: string;
    slug: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
    isActive: boolean;
    priority: number;
    userCount: number;
}

const mockRoles: Role[] = [
    {
        id: "1",
        name: "Super Admin",
        slug: "super-admin",
        description: "Full system access with all permissions",
        permissions: ["*"],
        isSystemRole: true,
        isActive: true,
        priority: 100,
        userCount: 3,
    },
    {
        id: "2",
        name: "Admin",
        slug: "admin",
        description: "Administrative access with user management",
        permissions: ["users.read", "users.write", "roles.read", "settings.read", "settings.write"],
        isSystemRole: true,
        isActive: true,
        priority: 80,
        userCount: 12,
    },
    {
        id: "3",
        name: "Staff",
        slug: "staff",
        description: "Staff members with limited access",
        permissions: ["users.read", "students.read", "students.write", "courses.read"],
        isSystemRole: true,
        isActive: true,
        priority: 60,
        userCount: 156,
    },
    {
        id: "4",
        name: "Center",
        slug: "center",
        description: "Center administrators",
        permissions: ["students.read", "students.write", "courses.read", "reports.read"],
        isSystemRole: true,
        isActive: true,
        priority: 50,
        userCount: 48,
    },
    {
        id: "5",
        name: "Student",
        slug: "student",
        description: "Student access to learning resources",
        permissions: ["courses.read", "certificates.read", "profile.read", "profile.write"],
        isSystemRole: true,
        isActive: true,
        priority: 20,
        userCount: 8432,
    },
    {
        id: "6",
        name: "User",
        slug: "user",
        description: "Basic user access",
        permissions: ["profile.read", "profile.write"],
        isSystemRole: true,
        isActive: true,
        priority: 10,
        userCount: 4196,
    },
];

const permissionCategories = [
    {
        name: "Users",
        permissions: ["users.read", "users.write", "users.delete"],
    },
    {
        name: "Roles",
        permissions: ["roles.read", "roles.write", "roles.delete"],
    },
    {
        name: "Students",
        permissions: ["students.read", "students.write", "students.delete"],
    },
    {
        name: "Courses",
        permissions: ["courses.read", "courses.write", "courses.delete"],
    },
    {
        name: "Certificates",
        permissions: ["certificates.read", "certificates.write", "certificates.revoke"],
    },
    {
        name: "Settings",
        permissions: ["settings.read", "settings.write"],
    },
];

export default function RolesPage() {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Shield className="h-6 w-6 text-primary" />
                        Roles & Permissions
                    </h1>
                    <p className="text-muted-foreground">
                        Configure roles and manage permission access levels
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Role
                </Button>
            </div>

            {/* Roles List */}
            <div className="space-y-4">
                {mockRoles.map((role) => (
                    <Card key={role.id} className="overflow-hidden">
                        <CardHeader
                            className="cursor-pointer"
                            onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            {role.name}
                                            {role.isSystemRole && (
                                                <Badge variant="secondary" className="text-xs">
                                                    System
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription>{role.description}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        {role.userCount.toLocaleString()}
                                    </div>
                                    <Badge
                                        variant={role.isActive ? "default" : "secondary"}
                                        className="capitalize"
                                    >
                                        {role.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {expandedRole === role.id ? (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {expandedRole === role.id && (
                            <CardContent className="border-t bg-muted/30 pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">Permissions</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                Role Active
                                            </span>
                                            <Switch checked={role.isActive} />
                                        </div>
                                    </div>

                                    {role.permissions.includes("*") ? (
                                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                                            <p className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                                                <Shield className="h-4 w-4" />
                                                Full Access (All Permissions)
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                This role has unrestricted access to all system features
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {permissionCategories.map((category) => (
                                                <div key={category.name} className="rounded-lg border p-3">
                                                    <h5 className="mb-2 font-medium">{category.name}</h5>
                                                    <div className="space-y-2">
                                                        {category.permissions.map((permission) => {
                                                            const hasPermission = role.permissions.includes(permission);
                                                            return (
                                                                <div
                                                                    key={permission}
                                                                    className="flex items-center justify-between text-sm"
                                                                >
                                                                    <span className="capitalize text-muted-foreground">
                                                                        {permission.split(".")[1]}
                                                                    </span>
                                                                    {hasPermission ? (
                                                                        <Check className="h-4 w-4 text-emerald-500" />
                                                                    ) : (
                                                                        <X className="h-4 w-4 text-muted-foreground/30" />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="outline" size="sm">
                                            <MoreHorizontal className="mr-1 h-4 w-4" />
                                            Actions
                                        </Button>
                                        <Button size="sm">Edit Role</Button>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
