'use server';

import connectDB from '@/lib/db';
import { Course } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all courses
export async function getCourses() {
    try {
        await connectDB();
        const courses = await Course.find()
            .sort({ name: 1 })
            .lean();

        return JSON.parse(JSON.stringify(courses));
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

// Get course by ID
export async function getCourseById(id: string) {
    try {
        await connectDB();
        const course = await Course.findById(id).lean();

        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        console.error('Error fetching course:', error);
        return null;
    }
}

// Create course
export async function createCourse(data: any) {
    try {
        await connectDB();
        const course = await Course.create(data);

        revalidatePath('/skills/courses');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(course))
        };
    } catch (error: any) {
        console.error('Error creating course:', error);
        return {
            success: false,
            error: error.message || 'Failed to create course'
        };
    }
}

// Update course
export async function updateCourse(id: string, data: any) {
    try {
        await connectDB();
        const course = await Course.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        revalidatePath('/skills/courses');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(course))
        };
    } catch (error: any) {
        console.error('Error updating course:', error);
        return {
            success: false,
            error: error.message || 'Failed to update course'
        };
    }
}

// Delete course
export async function deleteCourse(id: string) {
    try {
        await connectDB();
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        revalidatePath('/skills/courses');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting course:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete course'
        };
    }
}
