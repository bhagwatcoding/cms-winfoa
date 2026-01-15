'use server';

import connectDB from '@/shared/lib/db';
import { Course } from '@/models';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/shared/lib/utils';
import { createCourseSchema, updateCourseSchema } from '@/shared/lib/utils/validations';
import { validateSchema } from '@/shared/lib/utils/validations/utils';

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
export async function createCourse(data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(createCourseSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const course = await Course.create(validation.data);

        revalidatePath('/skills/courses');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(course))
        };
    } catch (error) {
        console.error('Error creating course:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to create course'
        };
    }
}

// Update course
export async function updateCourse(id: string, data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(updateCourseSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const course = await Course.findByIdAndUpdate(
            id,
            { $set: validation.data },
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
    } catch (error) {
        console.error('Error updating course:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update course'
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
    } catch (error) {
        console.error('Error deleting course:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to delete course'
        };
    }
}
