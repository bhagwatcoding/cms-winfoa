"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { UserPlus, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { Input, Button, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/ui';
import { createStudent } from '@/actions/skills/students';
import { getCourses } from '@/actions/skills/courses';

interface Course {
    _id: string;
    name: string;
    code: string;
    duration: string;
    fee: number;
}

export default function AdmissionPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [profileImagePreview, setProfileImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        motherName: '',
        dob: '',
        gender: 'male',
        courseId: '',
        profileImage: ''
    });

    // Load courses on mount
    useEffect(() => {
        const loadCourses = async () => {
            setIsLoadingCourses(true);
            const coursesData = await getCourses();
            setCourses(coursesData);
            setIsLoadingCourses(false);
        };
        loadCourses();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setProfileImagePreview(base64String);
                setFormData({ ...formData, profileImage: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.fatherName || !formData.motherName || !formData.dob || !formData.courseId) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please fill in all required fields.",
            });
            return;
        }

        startTransition(async () => {
            try {
                const result = await createStudent(formData);

                if (result.success) {
                    toast({
                        variant: "success",
                        title: "Success!",
                        description: "Student registered successfully.",
                    });

                    // Reset form
                    setFormData({
                        name: '',
                        fatherName: '',
                        motherName: '',
                        dob: '',
                        gender: 'male',
                        courseId: '',
                        profileImage: ''
                    });
                    setProfileImagePreview('');

                    // Reset file input
                    const fileInput = document.getElementById('photo') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: result.error || "Failed to register student. Please try again.",
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

    const handleReset = () => {
        setFormData({
            name: '',
            fatherName: '',
            motherName: '',
            dob: '',
            gender: 'male',
            courseId: '',
            profileImage: ''
        });
        setProfileImagePreview('');
        const fileInput = document.getElementById('photo') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                        <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">New Admission</h1>
                        <p className="text-sm text-slate-500">Register a new student to the system</p>
                    </div>
                </div>
            </div>

            <Card className="border-slate-200 shadow-lg">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <CardTitle className="text-xl">Student Information</CardTitle>
                    <CardDescription>Fill in the details to register a new student</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-slate-200 bg-slate-100 overflow-hidden shadow-md">
                                    {profileImagePreview ? (
                                        <img
                                            src={profileImagePreview}
                                            alt="Profile preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <UserPlus className="h-12 w-12 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="photo"
                                    className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
                                >
                                    <Upload className="h-4 w-4" />
                                </label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Student Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Student Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="transition-all focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Father's Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fatherName" className="text-sm font-medium">
                                    Father&apos;s Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="fatherName"
                                    placeholder="Enter father&apos;s name"
                                    value={formData.fatherName}
                                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                    required
                                    className="transition-all focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Mother's Name */}
                            <div className="space-y-2">
                                <Label htmlFor="motherName" className="text-sm font-medium">
                                    Mother&apos;s Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="motherName"
                                    placeholder="Enter mother's name"
                                    value={formData.motherName}
                                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                    required
                                    className="transition-all focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-sm font-medium">
                                    Date of Birth <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    required
                                    className="transition-all focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-sm font-medium">
                                    Gender <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                >
                                    <SelectTrigger id="gender" className="transition-all focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Course */}
                            <div className="space-y-2">
                                <Label htmlFor="course" className="text-sm font-medium">
                                    Course <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.courseId}
                                    onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                                    disabled={isLoadingCourses}
                                >
                                    <SelectTrigger id="course" className="transition-all focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select a course"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course._id} value={course._id}>
                                                {course.name} ({course.code}) - ₹{course.fee}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleReset}
                                disabled={isPending}
                                className="min-w-[100px]"
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="min-w-[150px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Register Student
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
