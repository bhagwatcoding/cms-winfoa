"use client";

import React, { useState, useEffect, useTransition } from 'react';
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Search,
    UserCheck,
    UserX,
    GraduationCap,
    Calendar,
    Mail,
    Phone
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    useToast
} from '@/ui';
import { getStudents, updateStudent, deleteStudent } from '@/actions/skills/students';
import { getCourses } from '@/actions/skills/courses';

interface Student {
    _id: string;
    name: string;
    fatherName: string;
    motherName: string;
    dob: string;
    gender: string;
    courseId: string | { _id: string; name: string; code: string };
    status: string;
    profileImage?: string;
    createdAt?: string;
}

interface Course {
    _id: string;
    name: string;
    code: string;
}

export default function StudentsPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        motherName: '',
        dob: '',
        gender: 'male',
        courseId: '',
        status: 'active'
    });

    // Load data function
    const loadData = async () => {
        setIsLoading(true);
        const [studentsData, coursesData] = await Promise.all([
            getStudents(),
            getCourses()
        ]);
        setStudents(studentsData);
        setCourses(coursesData);
        setIsLoading(false);
    };

    // Initial load
    useEffect(() => {
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter students
    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.motherName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Stats
    const stats = {
        total: students.length,
        active: students.filter(s => s.status === 'active').length,
        completed: students.filter(s => s.status === 'completed').length,
        dropped: students.filter(s => s.status === 'dropped').length
    };

    // Handle edit
    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        const courseIdValue = typeof student.courseId === 'object'
            ? student.courseId?._id
            : student.courseId || '';
        setFormData({
            name: student.name,
            fatherName: student.fatherName,
            motherName: student.motherName,
            dob: student.dob.split('T')[0],
            gender: student.gender,
            courseId: courseIdValue,
            status: student.status
        });
        setIsDialogOpen(true);
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingStudent) return;

        startTransition(async () => {
            try {
                const result = await updateStudent(editingStudent._id, formData);

                if (result.success) {
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: "Student updated successfully.",
                    });
                    setIsDialogOpen(false);
                    loadData();
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error || "Failed to update student.",
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred.",
                });
            }
        });
    };

    // Handle delete
    const handleDelete = async (studentId: string, studentName: string) => {
        startTransition(async () => {
            try {
                const result = await deleteStudent(studentId);

                if (result.success) {
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: `Student "${studentName}" deleted successfully.`,
                    });
                    loadData();
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error || "Failed to delete student.",
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred.",
                });
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Students
                        </h1>
                        <p className="text-sm text-slate-500">Manage student records and information</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total</p>
                                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Active</p>
                                <p className="text-3xl font-bold text-green-900">{stats.active}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Completed</p>
                                <p className="text-3xl font-bold text-purple-900">{stats.completed}</p>
                            </div>
                            <GraduationCap className="h-8 w-8 text-purple-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Dropped</p>
                                <p className="text-3xl font-bold text-red-900">{stats.dropped}</p>
                            </div>
                            <UserX className="h-8 w-8 text-red-600 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-slate-200">
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search by name, father's name, or mother's name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="dropped">Dropped</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="border-slate-200">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle>Student Records</CardTitle>
                    <CardDescription>
                        Showing {filteredStudents.length} of {students.length} students
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                            <p className="mt-2 text-sm text-slate-500">Loading students...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="p-12 text-center">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-slate-600">No students found</p>
                            <p className="text-sm text-slate-500 mt-1">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Add your first student to get started'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Parents
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Course
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {filteredStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {student.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {student.gender}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-900">
                                                    F: {student.fatherName}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    M: {student.motherName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-slate-900">
                                                    {typeof student.courseId === 'object' ? student.courseId?.name : 'N/A'}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {typeof student.courseId === 'object' ? student.courseId?.code : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : student.status === 'completed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Dialog open={isDialogOpen && editingStudent?._id === student._id} onOpenChange={setIsDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(student)}
                                                                disabled={isPending}
                                                                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[500px]">
                                                            <form onSubmit={handleSubmit}>
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit Student</DialogTitle>
                                                                    <DialogDescription>
                                                                        Update student information
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <div className="grid gap-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="edit-name">Student Name</Label>
                                                                        <Input
                                                                            id="edit-name"
                                                                            value={formData.name}
                                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                            required
                                                                        />
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="edit-father">Father&apos;s Name</Label>
                                                                            <Input
                                                                                id="edit-father"
                                                                                value={formData.fatherName}
                                                                                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="edit-mother">Mother&apos;s Name</Label>
                                                                            <Input
                                                                                id="edit-mother"
                                                                                value={formData.motherName}
                                                                                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="edit-course">Course</Label>
                                                                            <Select
                                                                                value={formData.courseId}
                                                                                onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                                                                            >
                                                                                <SelectTrigger id="edit-course">
                                                                                    <SelectValue placeholder="Select course" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {courses.map((course) => (
                                                                                        <SelectItem key={course._id} value={course._id}>
                                                                                            {course.name}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="edit-status">Status</Label>
                                                                            <Select
                                                                                value={formData.status}
                                                                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                                                            >
                                                                                <SelectTrigger id="edit-status">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="active">Active</SelectItem>
                                                                                    <SelectItem value="completed">Completed</SelectItem>
                                                                                    <SelectItem value="dropped">Dropped</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <DialogFooter>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={() => setIsDialogOpen(false)}
                                                                        disabled={isPending}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        type="submit"
                                                                        disabled={isPending}
                                                                        className="bg-gradient-to-r from-blue-600 to-blue-700"
                                                                    >
                                                                        {isPending ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Updating...
                                                                            </>
                                                                        ) : (
                                                                            'Update Student'
                                                                        )}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isPending}
                                                                className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will permanently delete &quot;{student.name}&quot;.
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(student._id, student.name)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
