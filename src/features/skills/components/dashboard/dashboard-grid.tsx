'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/ui'
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'

interface DashboardGridProps {
    counts: {
        students?: number
        courses?: number
        employees?: number
        certificates?: number
    }
}

export function DashboardGrid({ counts }: DashboardGridProps) {
    const stats = [
        {
            title: 'Total Students',
            value: counts.students || 0,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Active Courses',
            value: counts.courses || 0,
            icon: BookOpen,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Employees',
            value: counts.employees || 0,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Certificates Issued',
            value: counts.certificates || 0,
            icon: GraduationCap,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <TrendingUp className="inline h-3 w-3 mr-1" />
                                Active now
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
