"use client";

import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CoursesPage() {
    const courses = [
        { id: 1, name: 'Computer Basics', code: 'CB-101', duration: '3 Months', fee: 5000, students: 45 },
        { id: 2, name: 'Advanced Excel', code: 'EX-201', duration: '2 Months', fee: 4000, students: 32 },
        { id: 3, name: 'Web Development', code: 'WD-301', duration: '6 Months', fee: 12000, students: 28 },
        { id: 4, name: 'Graphic Design', code: 'GD-201', duration: '4 Months', fee: 8000, students: 20 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-cyan-100 p-3">
                        <BookOpen className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Courses</h1>
                        <p className="text-sm text-slate-500">Manage available training programs</p>
                    </div>
                </div>
                <Button>
                    <Plus className="h-4 w-4" />
                    Add Course
                </Button>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{course.name}</CardTitle>
                                    <CardDescription>{course.code}</CardDescription>
                                </div>
                                <div className="rounded-full bg-blue-100 px-3 py-1">
                                    <span className="text-xs font-semibold text-blue-700">{course.students} students</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">Duration</p>
                                    <p className="font-semibold">{course.duration}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Fee</p>
                                    <p className="font-semibold">₹{course.fee.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                                <Button variant="outline" size="sm" className="flex-1">View</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
