"use server";

import connectDB from '@/lib/db';
import Course from '@/edu/models/Course';
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

        // Check if course code already exists
        const existingCourse = await Course.findOne({ code: data.code });
        if (existingCourse) {
            return { success: false, error: 'Course code already exists' };
        }

        const course = await Course.create(data);
        revalidatePath('/center/courses');
        revalidatePath('/center/admission');
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error: any) {
        console.error('Failed to create course:', error);
        if (error.code === 11000) {
            return { success: false, error: 'Course code already exists' };
        }
        return { success: false, error: error.message || 'Failed to create course' };
    }
}

export async function updateCourse(id: string, data: any) {
    try {
        await connectDB();

        // Check if updating to an existing course code
        if (data.code) {
            const existingCourse = await Course.findOne({ code: data.code, _id: { $ne: id } });
            if (existingCourse) {
                return { success: false, error: 'Course code already exists' };
            }
        }

        const course = await Course.findByIdAndUpdate(id, data, { new: true });
        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        revalidatePath('/center/courses');
        revalidatePath('/center/admission');
        return { success: true, data: JSON.parse(JSON.stringify(course)) };
    } catch (error: any) {
        console.error('Failed to update course:', error);
        if (error.code === 11000) {
            return { success: false, error: 'Course code already exists' };
        }
        return { success: false, error: error.message || 'Failed to update course' };
    }
}

export async function deleteCourse(id: string) {
    try {
        await connectDB();
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return { success: false, error: 'Course not found' };
        }
        revalidatePath('/center/courses');
        revalidatePath('/center/admission');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete course:', error);
        return { success: false, error: error.message || 'Failed to delete course' };
    }
}
