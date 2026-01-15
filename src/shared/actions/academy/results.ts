'use server';

import connectDB from '@/shared/lib/db';
import { Result } from '@/models';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/shared/lib/utils';
import { createResultSchema, updateResultSchema } from '@/shared/lib/utils/validations';
import { validateSchema } from '@/shared/lib/utils/validations/utils';

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
export async function createResult(data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(createResultSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const result = await Result.create(validation.data!);

        revalidatePath('/skills/results');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(result))
        };
    } catch (error) {
        console.error('Error creating result:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to create result'
        };
    }
}

// Update result
export async function updateResult(id: string, data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(updateResultSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const result = await Result.findByIdAndUpdate(
            id,
            { $set: validation.data! },
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
    } catch (error) {
        console.error('Error updating result:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update result'
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
    } catch (error) {
        console.error('Error deleting result:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to delete result'
        };
    }
}
