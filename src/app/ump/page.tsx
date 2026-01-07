import { Users, Building2, CreditCard, Settings, BarChart3, Shield } from 'lucide-react'

export default function UMPDashboardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-gray-600 bg-clip-text text-transparent">
                        UMP - Universal Management Portal
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Multi-tenant administration and billing management
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Users', value: '12,543', icon: Users, color: 'blue' },
                        { label: 'Active Tenants', value: '247', icon: Building2, color: 'green' },
                        { label: 'Monthly Revenue', value: '$45,231', icon: CreditCard, color: 'purple' },
                        { label: 'API Requests', value: '1.2M', icon: BarChart3, color: 'orange' },
                    ].map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`h-10 w-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                                        <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                                </div>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Management Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Management */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-semibold">User Management</h2>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">All Users</div>
                                <div className="text-sm text-muted-foreground">View and manage all users</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Roles & Permissions</div>
                                <div className="text-sm text-muted-foreground">Configure user access levels</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Activity Logs</div>
                                <div className="text-sm text-muted-foreground">Monitor user activities</div>
                            </button>
                        </div>
                    </div>

                    {/* Tenant Management */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="h-6 w-6 text-green-600" />
                            <h2 className="text-xl font-semibold">Tenant Management</h2>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">All Tenants</div>
                                <div className="text-sm text-muted-foreground">Manage organizations</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Subscriptions</div>
                                <div className="text-sm text-muted-foreground">View subscription plans</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Resource Usage</div>
                                <div className="text-sm text-muted-foreground">Monitor resource consumption</div>
                            </button>
                        </div>
                    </div>

                    {/* Billing */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="h-6 w-6 text-purple-600" />
                            <h2 className="text-xl font-semibold">Billing & Payments</h2>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Invoices</div>
                                <div className="text-sm text-muted-foreground">View all invoices</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Payment Methods</div>
                                <div className="text-sm text-muted-foreground">Manage payment options</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Revenue Analytics</div>
                                <div className="text-sm text-muted-foreground">Track revenue metrics</div>
                            </button>
                        </div>
                    </div>

                    {/* System Settings */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings className="h-6 w-6 text-orange-600" />
                            <h2 className="text-xl font-semibold">System Settings</h2>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">General Settings</div>
                                <div className="text-sm text-muted-foreground">Configure system preferences</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Security</div>
                                <div className="text-sm text-muted-foreground">Manage security policies</div>
                            </button>
                            <button className="w-full p-3 text-left rounded-lg hover:bg-muted transition-colors">
                                <div className="font-medium">Integrations</div>
                                <div className="text-sm text-muted-foreground">Third-party integrations</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const metadata = {
    title: 'UMP Dashboard - WINFOA',
    description: 'Universal Management Portal - Admin Dashboard'
}
