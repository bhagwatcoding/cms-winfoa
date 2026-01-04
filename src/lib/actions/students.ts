"use server";

import connectDB from '@/lib/db';
import Student from '@/lib/models/Student';
import { revalidatePath } from 'next/cache';

export async function getStudents(centerId?: string) {
    try {
        await connectDB();
        const query = centerId ? { centerId } : {};
        const students = await Student.find(query)
            .populate('courseId')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(students));
    } catch (error) {
        console.error('Failed to fetch students:', error);
        return [];
    }
}

export async function getStudentById(id: string) {
    try {
        await connectDB();
        const student = await Student.findById(id)
            .populate('courseId')
            .populate('centerId')
            .lean();
        return JSON.parse(JSON.stringify(student));
    } catch (error) {
        console.error('Failed to fetch student:', error);
        return null;
    }
}

export async function createStudent(data: any) {
    try {
        await connectDB();
        const student = await Student.create(data);
        revalidatePath('/students');
        return { success: true, data: JSON.parse(JSON.stringify(student)) };
    } catch (error) {
        console.error('Failed to create student:', error);
        return { success: false, error: 'Failed to create student' };
    }
}

export async function updateStudent(id: string, data: any) {
    try {
        await connectDB();
        const student = await Student.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/students');
        return { success: true, data: JSON.parse(JSON.stringify(student)) };
    } catch (error) {
        console.error('Failed to update student:', error);
        return { success: false, error: 'Failed to update student' };
    }
}

export async function deleteStudent(id: string) {
    try {
        await connectDB();
        await Student.findByIdAndDelete(id);
        revalidatePath('/students');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete student:', error);
        return { success: false, error: 'Failed to delete student' };
    }
}

export async function getStudentStats(centerId?: string) {
    try {
        await connectDB();
        const query = centerId ? { centerId } : {};

        const [total, active, completed, dropped] = await Promise.all([
            Student.countDocuments(query),
            Student.countDocuments({ ...query, status: 'active' }),
            Student.countDocuments({ ...query, status: 'completed' }),
            Student.countDocuments({ ...query, status: 'dropped' }),
        ]);

        return {
            total,
            active,
            completed,
            dropped,
        };
    } catch (error) {
        console.error('Failed to fetch student stats:', error);
        return {
            total: 0,
            active: 0,
            completed: 0,
            dropped: 0,
        };
    }
}
