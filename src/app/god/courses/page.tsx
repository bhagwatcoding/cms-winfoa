"use client";

import { DataTable, StatusBadge, type Column } from "@/features/god";
import { Badge, Button } from "@/ui";
import {
    BookOpen,
    Plus,
    Clock,
    IndianRupee,
    Users,
    MoreHorizontal,
    GraduationCap,
} from "lucide-react";

// Mock course data
interface Course {
    id: string;
    name: string;
    description: string;
    duration: number;
    fees: number;
    category: string;
    level: string;
    isActive: boolean;
    enrolledCount: number;
    completedCount: number;
}

const mockCourses: Course[] = [
    {
        id: "1",
        name: "Web Development Fundamentals",
        description: "Learn HTML, CSS, and JavaScript basics",
        duration: 3,
        fees: 15000,
        category: "Technology",
        level: "beginner",
        isActive: true,
        enrolledCount: 234,
        completedCount: 189,
    },
    {
        id: "2",
        name: "Data Science with Python",
        description: "Python programming for data analysis",
        duration: 6,
        fees: 25000,
        category: "Technology",
        level: "intermediate",
        isActive: true,
        enrolledCount: 156,
        completedCount: 98,
    },
    {
        id: "3",
        name: "Digital Marketing Mastery",
        description: "Complete digital marketing course",
        duration: 4,
        fees: 18000,
        category: "Marketing",
        level: "beginner",
        isActive: true,
        enrolledCount: 312,
        completedCount: 245,
    },
    {
        id: "4",
        name: "Advanced React Development",
        description: "Master React, Redux, and modern patterns",
        duration: 4,
        fees: 22000,
        category: "Technology",
        level: "advanced",
        isActive: true,
        enrolledCount: 89,
        completedCount: 67,
    },
    {
        id: "5",
        name: "Business Communication",
        description: "Professional communication skills",
        duration: 2,
        fees: 12000,
        category: "Business",
        level: "beginner",
        isActive: false,
        enrolledCount: 0,
        completedCount: 412,
    },
];

const levelColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    beginner: "outline",
    intermediate: "secondary",
    advanced: "default",
};

const columns: Column<Course>[] = [
    {
        key: "name",
        header: "Course",
        render: (course) => (
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div className="max-w-xs">
                    <p className="font-medium">{course.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                        {course.description}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "category",
        header: "Category",
        render: (course) => (
            <Badge variant="outline">{course.category}</Badge>
        ),
    },
    {
        key: "level",
        header: "Level",
        render: (course) => (
            <Badge variant={levelColors[course.level]} className="capitalize">
                {course.level}
            </Badge>
        ),
    },
    {
        key: "duration",
        header: "Duration",
        render: (course) => (
            <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {course.duration} months
            </div>
        ),
    },
    {
        key: "fees",
        header: "Fees",
        render: (course) => (
            <div className="flex items-center gap-0.5 font-medium">
                <IndianRupee className="h-3 w-3" />
                {course.fees.toLocaleString()}
            </div>
        ),
    },
    {
        key: "enrolledCount",
        header: "Enrolled",
        render: (course) => (
            <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{course.enrolledCount}</span>
            </div>
        ),
    },
    {
        key: "isActive",
        header: "Status",
        render: (course) => (
            <StatusBadge status={course.isActive ? "active" : "inactive"} />
        ),
    },
    {
        key: "actions",
        header: "",
        className: "w-12",
        render: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        ),
    },
];

export default function CoursesPage() {
    const totalEnrolled = mockCourses.reduce((sum, c) => sum + c.enrolledCount, 0);
    const totalCompleted = mockCourses.reduce((sum, c) => sum + c.completedCount, 0);
    const activeCourses = mockCourses.filter((c) => c.isActive).length;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <BookOpen className="h-6 w-6 text-primary" />
                        Course Catalog
                    </h1>
                    <p className="text-muted-foreground">
                        Manage courses, curriculum, and enrollment
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Course
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Total Courses</p>
                    <p className="text-2xl font-bold">{mockCourses.length}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-emerald-500">{activeCourses}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Enrolled</p>
                    <p className="text-2xl font-bold">{totalEnrolled}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="flex items-center gap-1 text-2xl font-bold">
                        <GraduationCap className="h-5 w-5 text-emerald-500" />
                        {totalCompleted}
                    </p>
                </div>
            </div>

            {/* Courses Table */}
            <DataTable
                data={mockCourses}
                columns={columns}
                title="All Courses"
                description="Course catalog and enrollment details"
                searchPlaceholder="Search courses..."
            />
        </div>
    );
}
