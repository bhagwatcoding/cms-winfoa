"use client";

import React from 'react';
import { Users, UserCheck, UserX, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentsPage() {
    // Mock data - will be replaced with real data from API
    const students = [
        { id: 1, name: 'Rajesh Kumar', course: 'Web Development', status: 'active', joinDate: '2024-01-15' },
        { id: 2, name: 'Priya Singh', course: 'Computer Basics', status: 'active', joinDate: '2024-01-20' },
        { id: 3, name: 'Amit Sharma', course: 'Advanced Excel', status: 'completed', joinDate: '2023-12-10' },
    ];

    const stats = {
        total: 145,
        active: 120,
        completed: 20,
        dropped: 5,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-3">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Students</h1>
                        <p className="text-sm text-slate-500">Manage all student records</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-slate-500">All registered students</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <p className="text-xs text-slate-500">Currently studying</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
                        <p className="text-xs text-slate-500">Finished courses</p>
                    </CardContent>
                </Card>

                <Card className="col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dropped</CardTitle>
                        <UserX className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.dropped}</div>
                        <p className="text-xs text-slate-500">Left courses</p>
                    </CardContent>
                </Card>
            </div>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Students</CardTitle>
                    <CardDescription>List of recently registered students</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Name</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Course</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Status</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Join Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 text-sm font-medium">{student.name}</td>
                                        <td className="py-3 text-sm text-slate-600">{student.course}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-slate-600">{student.joinDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
