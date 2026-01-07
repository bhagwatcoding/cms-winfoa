"use client";

import React, { useState } from 'react';
import { GraduationCap, Award, TrendingUp, FileText, Search, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResultsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - will be replaced with real data from API
    const results = [
        { id: 1, studentName: 'Rajesh Kumar', course: 'Web Development', examDate: '2024-03-15', marks: 92, grade: 'A+', status: 'pass' },
        { id: 2, studentName: 'Priya Singh', course: 'Computer Basics', examDate: '2024-03-14', marks: 78, grade: 'B', status: 'pass' },
        { id: 3, studentName: 'Amit Sharma', course: 'Advanced Excel', examDate: '2024-03-13', marks: 88, grade: 'A', status: 'pass' },
        { id: 4, studentName: 'Neha Gupta', course: 'Graphic Design', examDate: '2024-03-10', marks: 95, grade: 'A+', status: 'pass' },
        { id: 5, studentName: 'Vikram Yadav', course: 'Web Development', examDate: '2024-03-08', marks: 65, grade: 'C', status: 'pass' },
    ];

    const stats = {
        totalExams: 145,
        passRate: 94.5,
        averageScore: 82.3,
        pending: 12,
    };

    const filteredResults = results.filter(result =>
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A+': return 'bg-green-100 text-green-700';
            case 'A': return 'bg-blue-100 text-blue-700';
            case 'B': return 'bg-cyan-100 text-cyan-700';
            case 'C': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-purple-100 p-3">
                        <GraduationCap className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Examination Results</h1>
                        <p className="text-sm text-slate-500">View and manage student results</p>
                    </div>
                </div>
                <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Add Result
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                        <FileText className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalExams}</div>
                        <p className="text-xs text-slate-500">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.passRate}%</div>
                        <p className="text-xs text-slate-500">Success rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Award className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.averageScore}%</div>
                        <p className="text-xs text-slate-500">Mean marks</p>
                    </CardContent>
                </Card>

                <Card className="col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <GraduationCap className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                        <p className="text-xs text-slate-500">Awaiting results</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search results by student name or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Results List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Results</CardTitle>
                    <CardDescription>Latest examination results</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Student</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500 hidden sm:table-cell">Course</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500 hidden md:table-cell">Exam Date</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Marks</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Grade</th>
                                    <th className="pb-3 text-right text-sm font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((result) => (
                                    <tr key={result.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{result.studentName}</span>
                                                <span className="text-xs text-slate-500 sm:hidden">{result.course}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600 hidden sm:table-cell">{result.course}</td>
                                        <td className="py-4 text-sm text-slate-600 hidden md:table-cell">{result.examDate}</td>
                                        <td className="py-4">
                                            <span className="text-sm font-semibold">{result.marks}%</span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getGradeColor(result.grade)}`}>
                                                {result.grade}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredResults.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                No results found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
