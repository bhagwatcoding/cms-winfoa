"use client";

import { useState } from "react";
import { 
    Badge, 
    Button, 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle, 
    Switch,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Label,
    Checkbox
} from "@/ui";
import {
    Shield,
    Plus,
    MoreHorizontal,
    Check,
    X,
    ChevronDown,
    ChevronRight,
    Users,
    Trash2,
    Edit
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createRoleAction, updateRoleAction, deleteRoleAction } from "@/shared/actions/roles";
import { PERMISSION_GROUPS } from "@/lib/permissions/constants";
import type { IRole } from "@/models";

interface RolesManagementProps {
    initialRoles: IRole[];
}

export function RolesManagement({ initialRoles }: RolesManagementProps) {
    const router = useRouter();
    const [expandedRole, setExpandedRole] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<IRole | null>(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        permissions: [] as string[],
        priority: 0
    });

    const resetForm = () => {
        setFormData({
            name: "",
            slug: "",
            description: "",
            permissions: [],
            priority: 0
        });
        setEditingRole(null);
    };

    const handleCreate = async () => {
        setLoading(true);
        const res = await createRoleAction(formData);
        setLoading(false);
        if (res.success) {
            setIsCreateOpen(false);
            resetForm();
            router.refresh();
        } else {
            alert(res.error);
        }
    };

    const handleUpdate = async () => {
        if (!editingRole) return;
        setLoading(true);
        const res = await updateRoleAction(editingRole._id.toString(), {
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
            priority: formData.priority
        });
        setLoading(false);
        if (res.success) {
            setEditingRole(null);
            resetForm();
            router.refresh();
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        const res = await deleteRoleAction(id);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.error);
        }
    };

    const togglePermission = (permission: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const openEdit = (role: IRole) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            slug: role.slug,
            description: role.description || "",
            permissions: role.permissions,
            priority: role.priority || 0
        });
    };

    return (
        <div className="space-y-6">
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
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2" onClick={resetForm}>
                            <Plus className="h-4 w-4" />
                            Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                            <DialogDescription>Define a new role and its permissions</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Role Name</Label>
                                    <Input 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Content Editor"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug (Unique)</Label>
                                    <Input 
                                        value={formData.slug}
                                        onChange={e => setFormData({...formData, slug: e.target.value})}
                                        placeholder="e.g. content-editor"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Role description..."
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <Label>Permissions</Label>
                                {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
                                    <div key={group} className="rounded-lg border p-4">
                                        <h4 className="mb-3 font-medium text-sm text-muted-foreground">{group}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {permissions.map(perm => (
                                                <div key={perm} className="flex items-center space-x-2">
                                                    <Checkbox 
                                                        id={`create-${perm}`}
                                                        checked={formData.permissions.includes(perm)}
                                                        onCheckedChange={() => togglePermission(perm)}
                                                    />
                                                    <label 
                                                        htmlFor={`create-${perm}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {perm}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button className="w-full" onClick={handleCreate} disabled={loading}>
                                {loading ? "Creating..." : "Create Role"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Role: {editingRole?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                        
                        <div className="space-y-4">
                            <Label>Permissions</Label>
                            {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => (
                                <div key={group} className="rounded-lg border p-4">
                                    <h4 className="mb-3 font-medium text-sm text-muted-foreground">{group}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {permissions.map(perm => (
                                            <div key={perm} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`edit-${perm}`}
                                                    checked={formData.permissions.includes(perm)}
                                                    onCheckedChange={() => togglePermission(perm)}
                                                    disabled={editingRole?.isSystem} // System roles might be locked
                                                />
                                                <label 
                                                    htmlFor={`edit-${perm}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {perm}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button className="w-full" onClick={handleUpdate} disabled={loading}>
                            {loading ? "Updating..." : "Update Role"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Roles List */}
            <div className="space-y-4">
                {initialRoles.map((role) => (
                    <Card key={role._id.toString()} className="overflow-hidden">
                        <CardHeader
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setExpandedRole(expandedRole === role._id.toString() ? null : role._id.toString())}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Shield className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            {role.name}
                                            {role.isSystem && (
                                                <Badge variant="secondary" className="text-xs">
                                                    System
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription>{role.description}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        variant={role.isActive ? "default" : "secondary"}
                                        className="capitalize"
                                    >
                                        {role.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                    {expandedRole === role._id.toString() ? (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {expandedRole === role._id.toString() && (
                            <CardContent className="border-t bg-muted/30 pt-4">
                                <div className="space-y-4">
                                    {role.permissions.includes("*:*") ? (
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
                                            {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => {
                                                const groupPermissions = role.permissions.filter(p => permissions.includes(p as any));
                                                if (groupPermissions.length === 0) return null;
                                                
                                                return (
                                                    <div key={group} className="rounded-lg border p-3 bg-background">
                                                        <h5 className="mb-2 font-medium text-xs text-muted-foreground uppercase tracking-wider">{group}</h5>
                                                        <div className="space-y-1">
                                                            {groupPermissions.map((permission) => (
                                                                <div
                                                                    key={permission}
                                                                    className="flex items-center gap-2 text-sm"
                                                                >
                                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                                    <span className="capitalize">
                                                                        {permission.split(":")[1]}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="outline" size="sm" onClick={() => openEdit(role)}>
                                            <Edit className="mr-1 h-4 w-4" />
                                            Edit Role
                                        </Button>
                                        {!role.isSystem && (
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(role._id.toString())}>
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Delete
                                            </Button>
                                        )}
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
