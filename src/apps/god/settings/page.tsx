"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Label,
    Switch,
    Separator,
} from "@/ui";
import {
    Settings,
    Save,
    Globe,
    Bell,
    Shield,
    Database,
    Mail,
    Palette,
    Clock,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "CMS Winfoa",
        siteUrl: "https://cms.winfoa.com",
        supportEmail: "support@winfoa.com",
        timezone: "Asia/Kolkata",
        emailNotifications: true,
        pushNotifications: true,
        maintenanceMode: false,
        registrationEnabled: true,
        twoFactorRequired: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        autoBackup: true,
        backupFrequency: "daily",
    });

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Settings className="h-6 w-6 text-primary" />
                        System Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Configure system-wide settings and preferences
                    </p>
                </div>
                <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-primary" />
                            General
                        </CardTitle>
                        <CardDescription>Basic system configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) =>
                                    setSettings({ ...settings, siteName: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteUrl">Site URL</Label>
                            <Input
                                id="siteUrl"
                                value={settings.siteUrl}
                                onChange={(e) =>
                                    setSettings({ ...settings, siteUrl: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input
                                id="supportEmail"
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) =>
                                    setSettings({ ...settings, supportEmail: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Input
                                id="timezone"
                                value={settings.timezone}
                                onChange={(e) =>
                                    setSettings({ ...settings, timezone: e.target.value })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Configure notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">
                                    Send email notifications for important events
                                </p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, emailNotifications: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Push Notifications</p>
                                <p className="text-sm text-muted-foreground">
                                    Enable browser push notifications
                                </p>
                            </div>
                            <Switch
                                checked={settings.pushNotifications}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, pushNotifications: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Maintenance Mode</p>
                                <p className="text-sm text-muted-foreground">
                                    Show maintenance page to non-admin users
                                </p>
                            </div>
                            <Switch
                                checked={settings.maintenanceMode}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, maintenanceMode: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Security
                        </CardTitle>
                        <CardDescription>Authentication and security options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">User Registration</p>
                                <p className="text-sm text-muted-foreground">
                                    Allow new users to register
                                </p>
                            </div>
                            <Switch
                                checked={settings.registrationEnabled}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, registrationEnabled: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Require Two-Factor Auth</p>
                                <p className="text-sm text-muted-foreground">
                                    Enforce 2FA for all admin users
                                </p>
                            </div>
                            <Switch
                                checked={settings.twoFactorRequired}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, twoFactorRequired: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sessionTimeout">Session Timeout (min)</Label>
                                <Input
                                    id="sessionTimeout"
                                    type="number"
                                    value={settings.sessionTimeout}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            sessionTimeout: parseInt(e.target.value) || 30,
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                                <Input
                                    id="maxLoginAttempts"
                                    type="number"
                                    value={settings.maxLoginAttempts}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            maxLoginAttempts: parseInt(e.target.value) || 5,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Backup Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Backup & Data
                        </CardTitle>
                        <CardDescription>Data backup and storage settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Automatic Backups</p>
                                <p className="text-sm text-muted-foreground">
                                    Schedule automatic database backups
                                </p>
                            </div>
                            <Switch
                                checked={settings.autoBackup}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, autoBackup: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Backup Frequency</Label>
                            <div className="flex gap-2">
                                {["hourly", "daily", "weekly"].map((freq) => (
                                    <Button
                                        key={freq}
                                        variant={settings.backupFrequency === freq ? "default" : "outline"}
                                        size="sm"
                                        onClick={() =>
                                            setSettings({ ...settings, backupFrequency: freq })
                                        }
                                        className="capitalize"
                                    >
                                        {freq}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <Separator />
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                                Create Backup Now
                            </Button>
                            <Button variant="outline" className="flex-1">
                                Restore from Backup
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
