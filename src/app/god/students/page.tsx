"use client";

import { DataTable, StatusBadge, type Column } from "@/features/god";
import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from "@/ui";
import {
    GraduationCap,
    Plus,
    BookOpen,
    Building2,
    Calendar,
    MoreHorizontal,
    User,
} from "lucide-react";

// Mock student data
interface Student {
    id: string;
    name: string;
    email?: string;
    fatherName: string;
    gender: string;
    dob: string;
    course: string;
    center: string;
    admissionDate: string;
    status: string;
    profileImage?: string;
}

const mockStudents: Student[] = [
    {
        id: "1",
        name: "Rahul Kumar",
        email: "rahul.k@example.com",
        fatherName: "Suresh Kumar",
        gender: "male",
        dob: "2000-05-15",
        course: "Web Development Fundamentals",
        center: "Delhi Central",
        admissionDate: "2024-01-10",
        status: "active",
    },
    {
        id: "2",
        name: "Priya Sharma",
        email: "priya.s@example.com",
        fatherName: "Rajesh Sharma",
        gender: "female",
        dob: "1999-08-22",
        course: "Data Science with Python",
        center: "Mumbai South",
        admissionDate: "2024-02-05",
        status: "active",
    },
    {
        id: "3",
        name: "Amit Singh",
        email: "amit.s@example.com",
        fatherName: "Ramesh Singh",
        gender: "male",
        dob: "2001-03-10",
        course: "Digital Marketing Mastery",
        center: "Bangalore Tech Hub",
        admissionDate: "2023-09-15",
        status: "completed",
    },
    {
        id: "4",
        name: "Neha Gupta",
        fatherName: "Vijay Gupta",
        gender: "female",
        dob: "2000-11-28",
        course: "Advanced React Development",
        center: "Chennai Central",
        admissionDate: "2024-03-01",
        status: "active",
    },
    {
        id: "5",
        name: "Vikram Patel",
        email: "vikram.p@example.com",
        fatherName: "Mohan Patel",
        gender: "male",
        dob: "1998-07-05",
        course: "Business Communication",
        center: "Delhi Central",
        admissionDate: "2023-06-20",
        status: "dropped",
    },
];

const columns: Column<Student>[] = [
    {
        key: "name",
        header: "Student",
        render: (student) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={student.profileImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{student.name}</p>
                    {student.email && (
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                    )}
                </div>
            </div>
        ),
    },
    {
        key: "course",
        header: "Course",
        render: (student) => (
            <div className="flex items-center gap-1.5 max-w-xs">
                <BookOpen className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">{student.course}</span>
            </div>
        ),
    },
    {
        key: "center",
        header: "Center",
        render: (student) => (
            <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{student.center}</span>
            </div>
        ),
    },
    {
        key: "admissionDate",
        header: "Admission",
        render: (student) => (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(student.admissionDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
            </div>
        ),
    },
    {
        key: "gender",
        header: "Gender",
        render: (student) => (
            <Badge variant="outline" className="capitalize">
                {student.gender}
            </Badge>
        ),
    },
    {
        key: "status",
        header: "Status",
        render: (student) => <StatusBadge status={student.status} />,
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

export default function StudentsPage() {
    const activeStudents = mockStudents.filter((s) => s.status === "active").length;
    const completedStudents = mockStudents.filter((s) => s.status === "completed").length;
    const droppedStudents = mockStudents.filter((s) => s.status === "dropped").length;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        Student Records
                    </h1>
                    <p className="text-muted-foreground">
                        Manage student enrollment, progress, and certificates
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Student
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">8,432</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-emerald-500">{activeStudents}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-blue-500">{completedStudents}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Dropped</p>
                    <p className="text-2xl font-bold text-rose-500">{droppedStudents}</p>
                </div>
            </div>

            {/* Students Table */}
            <DataTable
                data={mockStudents}
                columns={columns}
                title="All Students"
                description="Student enrollment and status"
                searchPlaceholder="Search students..."
            />
        </div>
    );
}
