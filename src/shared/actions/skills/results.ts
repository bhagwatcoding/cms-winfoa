'use server';

import connectDB from '@/lib/db';
import { Result, Student, Course } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all results
export async function getResults() {
    try {
        await connectDB();
        const results = await Result.find()
            .populate('studentId', 'name')
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(results));
    } catch (error) {
        console.error('Error fetching results:', error);
        return [];
    }
}

// Get result by ID
export async function getResultById(id: string) {
    try {
        await connectDB();
        const result = await Result.findById(id)
            .populate('studentId', 'name fatherName motherName')
            .populate('courseId', 'name code')
            .lean();

        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error('Error fetching result:', error);
        return null;
    }
}

// Create result
export async function createResult(data: any) {
    try {
        await connectDB();
        const result = await Result.create(data);

        revalidatePath('/skills/results');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(result))
        };
    } catch (error: any) {
        console.error('Error creating result:', error);
        return {
            success: false,
            error: error.message || 'Failed to create result'
        };
    }
}

// Update result
export async function updateResult(id: string, data: any) {
    try {
        await connectDB();
        const result = await Result.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!result) {
            return { success: false, error: 'Result not found' };
        }

        revalidatePath('/skills/results');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(result))
        };
    } catch (error: any) {
        console.error('Error updating result:', error);
        return {
            success: false,
            error: error.message || 'Failed to update result'
        };
    }
}

// Delete result
export async function deleteResult(id: string) {
    try {
        await connectDB();
        const result = await Result.findByIdAndDelete(id);

        if (!result) {
            return { success: false, error: 'Result not found' };
        }

        revalidatePath('/skills/results');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting result:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete result'
        };
    }
}
