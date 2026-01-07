'use client'

import { ReactNode } from 'react'
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/ui'
import { Home, Users, BookOpen, UserSquare, FileText, Award, CreditCard, Bell, Settings } from 'lucide-react'
import Link from 'next/link'

interface MainLayoutProps {
    children: ReactNode
    user?: {
        name: string
        email: string
        role: string
        centerName?: string
        walletBalance?: number
    } | null
    stats?: {
        total: number
        active: number
        completed: number
    } | null
}

export function MainLayout({ children, user, stats }: MainLayoutProps) {
    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/skills' },
        { icon: Users, label: 'Students', href: '/skills/students' },
        { icon: BookOpen, label: 'Courses', href: '/skills/courses' },
        { icon: UserSquare, label: 'Employees', href: '/skills/employees' },
        { icon: FileText, label: 'Results', href: '/skills/results' },
        { icon: Award, label: 'Certificates', href: '/skills/certificates' },
        { icon: CreditCard, label: 'Wallet', href: '/skills/wallet' },
        { icon: Bell, label: 'Notifications', href: '/skills/notifications' },
        { icon: Settings, label: 'Settings', href: '/skills/settings' }
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarHeader className="border-b px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-sm font-bold">W</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold">WinfoA</h2>
                                <p className="text-xs text-muted-foreground">Education Portal</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.href} className="flex items-center gap-3">
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarContent>

                    {user && (
                        <div className="border-t p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            {user.walletBalance !== undefined && (
                                <div className="mt-3 rounded-lg bg-muted p-2">
                                    <p className="text-xs text-muted-foreground">Wallet Balance</p>
                                    <p className="text-sm font-semibold">₹{user.walletBalance.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Sidebar>

                <main className="flex-1 overflow-auto bg-background">
                    <div className="container mx-auto p-6">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
