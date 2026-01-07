'use server';

import connectDB from '@/lib/db';
import { Student, Course } from '@/models';
import { revalidatePath } from 'next/cache';

// Get all students
export async function getStudents() {
    try {
        await connectDB();
        const students = await Student.find()
            .populate('courseId', 'name code')
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(students));
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

// Get student by ID
export async function getStudentById(id: string) {
    try {
        await connectDB();
        const student = await Student.findById(id)
            .populate('courseId', 'name code')
            .lean();

        return JSON.parse(JSON.stringify(student));
    } catch (error) {
        console.error('Error fetching student:', error);
        return null;
    }
}

// Create student
export async function createStudent(data: any) {
    try {
        await connectDB();
        const student = await Student.create(data);

        revalidatePath('/skills/students');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(student))
        };
    } catch (error: any) {
        console.error('Error creating student:', error);
        return {
            success: false,
            error: error.message || 'Failed to create student'
        };
    }
}

// Update student
export async function updateStudent(id: string, data: any) {
    try {
        await connectDB();
        const student = await Student.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!student) {
            return { success: false, error: 'Student not found' };
        }

        revalidatePath('/skills/students');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(student))
        };
    } catch (error: any) {
        console.error('Error updating student:', error);
        return {
            success: false,
            error: error.message || 'Failed to update student'
        };
    }
}

// Delete student
export async function deleteStudent(id: string) {
    try {
        await connectDB();
        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return { success: false, error: 'Student not found' };
        }

        revalidatePath('/skills/students');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting student:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete student'
        };
    }
}

// Get students statistics
export async function getStudentStats() {
    try {
        await connectDB();
        const [total, active, completed, dropped] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ status: 'active' }),
            Student.countDocuments({ status: 'completed' }),
            Student.countDocuments({ status: 'dropped' })
        ]);

        return { total, active, completed, dropped };
    } catch (error) {
        console.error('Error fetching student stats:', error);
        return { total: 0, active: 0, completed: 0, dropped: 0 };
    }
}
