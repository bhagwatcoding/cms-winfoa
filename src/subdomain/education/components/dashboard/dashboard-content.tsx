"use client";

import React from 'react';
import {
    Users,
    BookOpen,
    UserCheck,
    Award,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle2,
    XCircle,
    GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

interface DashboardStats {
    students: {
        total: number;
        active: number;
        completed: number;
        dropped: number;
    };
    courses: {
        total: number;
    };
    employees: {
        total: number;
        active: number;
    };
    results: {
        total: number;
        passed: number;
        failed: number;
        passPercentage: number;
    };
    recent: {
        students: any[];
        results: any[];
    };
}

interface DashboardContentProps {
    stats: DashboardStats | null;
}

export function DashboardContent({ stats }: DashboardContentProps) {
    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-lg font-semibold text-slate-600">Failed to load dashboard data</p>
                    <p className="text-sm text-slate-500 mt-2">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Students",
            value: stats.students.total,
            description: `${stats.students.active} active`,
            icon: Users,
            gradient: "from-blue-500 to-blue-600",
            bgGradient: "from-blue-50 to-blue-100",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600"
        },
        {
            title: "Active Students",
            value: stats.students.active,
            description: `${stats.students.completed} completed`,
            icon: UserCheck,
            gradient: "from-green-500 to-green-600",
            bgGradient: "from-green-50 to-green-100",
            iconBg: "bg-green-100",
            iconColor: "text-green-600"
        },
        {
            title: "Total Courses",
            value: stats.courses.total,
            description: "Available programs",
            icon: BookOpen,
            gradient: "from-cyan-500 to-cyan-600",
            bgGradient: "from-cyan-50 to-cyan-100",
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600"
        },
        {
            title: "Pass Rate",
            value: `${stats.results.passPercentage}%`,
            description: `${stats.results.passed}/${stats.results.total} passed`,
            icon: Award,
            gradient: "from-purple-500 to-purple-600",
            bgGradient: "from-purple-50 to-purple-100",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600"
        },
        {
            title: "Employees",
            value: stats.employees.total,
            description: `${stats.employees.active} active`,
            icon: GraduationCap,
            gradient: "from-orange-500 to-orange-600",
            bgGradient: "from-orange-50 to-orange-100",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600"
        },
        {
            title: "Results",
            value: stats.results.total,
            description: `${stats.results.failed} failed`,
            icon: CheckCircle2,
            gradient: "from-pink-500 to-pink-600",
            bgGradient: "from-pink-50 to-pink-100",
            iconBg: "bg-pink-100",
            iconColor: "text-pink-600"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-sm text-slate-500 mt-1">Welcome back! Here's your center overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className={`border-slate-200 hover:shadow-lg transition-all duration-200 overflow-hidden group`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
                            <CardHeader className="relative pb-3">
                                <div className="flex items-center justify-between">
                                    <CardDescription className="text-slate-600 font-medium">
                                        {stat.title}
                                    </CardDescription>
                                    <div className={`rounded-full ${stat.iconBg} p-2 group-hover:scale-110 transition-transform duration-200`}>
                                        <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="space-y-1">
                                    <p className="text-3xl font-bold text-slate-900">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {stat.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Students */}
                <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Recent Admissions</CardTitle>
                                <CardDescription>Latest student enrollments</CardDescription>
                            </div>
                            <Users className="h-5 w-5 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {stats.recent.students.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">No recent admissions</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recent.students.map((student: any, index: number) => (
                                    <div
                                        key={student._id || index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                {student.name?.charAt(0).toUpperCase() || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {student.courseId?.name || 'No course'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : student.status === 'completed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Results */}
                <Card className="border-slate-200">
                    <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Recent Results</CardTitle>
                                <CardDescription>Latest exam outcomes</CardDescription>
                            </div>
                            <Award className="h-5 w-5 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {stats.recent.results.length === 0 ? (
                            <div className="text-center py-8">
                                <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">No recent results</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.recent.results.map((result: any, index: number) => (
                                    <div
                                        key={result._id || index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${result.status === 'pass'
                                                    ? 'bg-green-100'
                                                    : 'bg-red-100'
                                                }`}>
                                                {result.status === 'pass' ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {result.studentId?.name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {result.courseId?.name || 'No course'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900">
                                                {result.marksObtained}/{result.totalMarks}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {Math.round((result.marksObtained / result.totalMarks) * 100)}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Summary */}
            <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100">
                            <p className="text-2xl font-bold text-green-600">{stats.students.completed}</p>
                            <p className="text-xs text-slate-600 mt-1">Completed</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100">
                            <p className="text-2xl font-bold text-red-600">{stats.students.dropped}</p>
                            <p className="text-xs text-slate-600 mt-1">Dropped</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100">
                            <p className="text-2xl font-bold text-blue-600">{stats.results.passed}</p>
                            <p className="text-xs text-slate-600 mt-1">Passed</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-white border border-slate-100">
                            <p className="text-2xl font-bold text-orange-600">{stats.results.failed}</p>
                            <p className="text-xs text-slate-600 mt-1">Failed</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
