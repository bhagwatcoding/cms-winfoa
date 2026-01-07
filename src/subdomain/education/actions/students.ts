"use server";

import { StudentService } from '@/lib/services';
import { revalidatePath } from 'next/cache';

export async function getStudents(centerId?: string) {
    try {
        const students = await StudentService.getAll(centerId);
        return JSON.parse(JSON.stringify(students));
    } catch (error) {
        console.error('Failed to fetch students:', error);
        return [];
    }
}

export async function getStudentById(id: string) {
    try {
        const student = await StudentService.getById(id);
        return JSON.parse(JSON.stringify(student));
    } catch (error) {
        console.error('Failed to fetch student:', error);
        return null;
    }
}

export async function createStudent(data: any) {
    try {
        const student = await StudentService.create(data);
        revalidatePath('/center/students');
        revalidatePath('/center/admission');
        return { success: true, data: JSON.parse(JSON.stringify(student)) };
    } catch (error: any) {
        console.error('Failed to create student:', error);
        return { success: false, error: error.message || 'Failed to create student' };
    }
}

export async function updateStudent(id: string, data: any) {
    try {
        const student = await StudentService.update(id, data);
        revalidatePath('/center/students');
        return { success: true, data: JSON.parse(JSON.stringify(student)) };
    } catch (error: any) {
        console.error('Failed to update student:', error);
        return { success: false, error: error.message || 'Failed to update student' };
    }
}

export async function deleteStudent(id: string) {
    try {
        await StudentService.delete(id);
        revalidatePath('/center/students');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete student:', error);
        return { success: false, error: error.message || 'Failed to delete student' };
    }
}

export async function getStudentStats(centerId?: string) {
    try {
        return await StudentService.getStats(centerId);
    } catch (error) {
        console.error('Failed to fetch student stats:', error);
        return { total: 0, active: 0, completed: 0, dropped: 0 };
    }
}

export async function searchStudents(searchTerm: string, centerId?: string) {
    try {
        const students = await StudentService.search(searchTerm, centerId);
        return JSON.parse(JSON.stringify(students));
    } catch (error) {
        console.error('Failed to search students:', error);
        return [];
    }
}
