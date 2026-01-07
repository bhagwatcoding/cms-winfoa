"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Loader2, Search, Users } from 'lucide-react';
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
    useToast
} from '@/ui';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/actions/skills/courses';

interface Course {
    _id: string;
    name: string;
    code: string;
    duration: string;
    fee: number;
    createdAt?: string;
    updatedAt?: string;
}

interface CourseFormData {
    name: string;
    code: string;
    duration: string;
    fee: string;
}

export default function CoursesPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<CourseFormData>({
        name: '',
        code: '',
        duration: '',
        fee: ''
    });

    // Load courses
    const loadCourses = async () => {
        setIsLoading(true);
        const data = await getCourses();
        setCourses(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadCourses();
    }, []);

    // Filter courses based on search
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            duration: '',
            fee: ''
        });
        setEditingCourse(null);
    };

    // Open dialog for adding
    const handleAddClick = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    // Open dialog for editing
    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            name: course.name,
            code: course.code,
            duration: course.duration,
            fee: course.fee.toString()
        });
        setIsDialogOpen(true);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.code || !formData.duration || !formData.fee) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all required fields.",
            });
            return;
        }

        const feeNumber = parseFloat(formData.fee);
        if (isNaN(feeNumber) || feeNumber <= 0) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please enter a valid fee amount.",
            });
            return;
        }

        startTransition(async () => {
            try {
                const courseData = {
                    name: formData.name,
                    code: formData.code,
                    duration: formData.duration,
                    fee: feeNumber
                };

                let result;
                if (editingCourse) {
                    result = await updateCourse(editingCourse._id, courseData);
                } else {
                    result = await createCourse(courseData);
                }

                if (result.success) {
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: editingCourse ? "Course updated successfully." : "Course created successfully.",
                    });
                    setIsDialogOpen(false);
                    resetForm();
                    loadCourses();
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error || "Failed to save course. Please try again.",
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                });
            }
        });
    };

    // Handle delete
    const handleDelete = async (courseId: string, courseName: string) => {
        startTransition(async () => {
            try {
                const result = await deleteCourse(courseId);

                if (result.success) {
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: `Course "${courseName}" deleted successfully.`,
                    });
                    loadCourses();
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error || "Failed to delete course. Please try again.",
                    });
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                });
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Courses
                        </h1>
                        <p className="text-sm text-slate-500">Manage available training programs</p>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleAddClick}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingCourse
                                        ? 'Update the course details below.'
                                        : 'Fill in the details to create a new course.'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Course Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Web Development"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">
                                        Course Code <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g., WD-301"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">
                                        Duration <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="duration"
                                        placeholder="e.g., 6 Months"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fee">
                                        Fee (₹) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fee"
                                        type="number"
                                        placeholder="e.g., 12000"
                                        value={formData.fee}
                                        onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                        required
                                        min="0"
                                        step="1"
                                    />
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
                                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        editingCourse ? 'Update Course' : 'Create Course'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search Bar */}
            <Card className="border-slate-200">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search courses by name or code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Courses Grid */}
            {isLoading ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2 mt-2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-200 rounded"></div>
                                    <div className="h-4 bg-slate-200 rounded"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredCourses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-lg font-semibold text-slate-600">
                            {searchQuery ? 'No courses found' : 'No courses yet'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            {searchQuery
                                ? 'Try adjusting your search query'
                                : 'Get started by adding your first course'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card
                            key={course._id}
                            className="hover:shadow-lg transition-all duration-200 border-slate-200 group"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg group-hover:text-cyan-600 transition-colors">
                                            {course.name}
                                        </CardTitle>
                                        <CardDescription className="font-mono text-xs mt-1">
                                            {course.code}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-medium">Duration</p>
                                        <p className="font-semibold text-slate-900">{course.duration}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-medium">Fee</p>
                                        <p className="font-semibold text-slate-900">₹{course.fee.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300"
                                        onClick={() => handleEditClick(course)}
                                        disabled={isPending}
                                    >
                                        <Pencil className="h-3 w-3 mr-1" />
                                        Edit
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                disabled={isPending}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the course "{course.name}".
                                                    This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(course._id, course.name)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {isPending ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        'Delete'
                                                    )}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Summary */}
            {!isLoading && filteredCourses.length > 0 && (
                <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-cyan-600" />
                                <span className="font-semibold text-slate-700">
                                    Total Courses: {filteredCourses.length}
                                </span>
                            </div>
                            {searchQuery && (
                                <span className="text-sm text-slate-600">
                                    Showing {filteredCourses.length} of {courses.length} courses
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
