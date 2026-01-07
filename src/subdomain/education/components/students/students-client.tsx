"use client";

import React, { useState } from 'react';
import { Users, UserCheck, UserX, GraduationCap, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Student {
    _id: string;
    name: string;
    fatherName: string;
    courseName: string;
    status: string;
    admissionDate: string;
}

interface StudentsClientProps {
    initialStudents: Student[];
}

export function StudentsClient({ initialStudents }: StudentsClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = initialStudents.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: initialStudents.length,
        active: initialStudents.filter(s => s.status === 'active').length,
        completed: initialStudents.filter(s => s.status === 'completed').length,
        dropped: initialStudents.filter(s => s.status === 'dropped').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-3">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Students</h1>
                        <p className="text-sm text-slate-500">Manage all student records</p>
                    </div>
                </div>
                <Link href="/admission">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Admission
                    </Button>
                </Link>
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

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search by name, father's name or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <CardTitle>Registered Students</CardTitle>
                    <CardDescription>List of all students enrolled in the center</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Name</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Father's Name</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Course</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Status</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Admission Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-3 text-sm font-medium">{student.name}</td>
                                        <td className="py-3 text-sm text-slate-600">{student.fatherName}</td>
                                        <td className="py-3 text-sm text-slate-600">{student.courseName}</td>
                                        <td className="py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${student.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    student.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-slate-600">{new Date(student.admissionDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                No students found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
