"use server";

import connectDB from '@/lib/db';
import Course from '@/lib/models/Course';
import { revalidatePath } from 'next/cache';

export async function getCourses() {
    try {
        await connectDB();
        const courses = await Course.find().sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(courses));
    } catch (error) {
        console.error('Failed to fetch courses:', error);
        return [];
    }
}

export async function getCourseById(id: string) {
    try {
        await connectDB();
        const course = await Course.findById(id).lean();
        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        console.error('Failed to fetch course:', error);
        return null;
    }
}

export async function createCourse(data: any) {
    try {
        await connectDB();
        const course = await Course.create(data);
        revalidatePath('/courses');
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error) {
        console.error('Failed to create course:', error);
        return { success: false, error: 'Failed to create course' };
    }
}

export async function updateCourse(id: string, data: any) {
    try {
        await connectDB();
        const course = await Course.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/courses');
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error) {
        console.error('Failed to update course:', error);
        return { success: false, error: 'Failed to update course' };
    }
}

export async function deleteCourse(id: string) {
    try {
        await connectDB();
        await Course.findByIdAndDelete(id);
        revalidatePath('/courses');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete course:', error);
        return { success: false, error: 'Failed to delete course' };
    }
}
