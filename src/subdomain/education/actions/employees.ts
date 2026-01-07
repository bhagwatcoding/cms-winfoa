"use server";

import { EmployeeService } from '@/lib/services';
import { revalidatePath } from 'next/cache';

export type EmployeeState = {
    errors?: {
        name?: string[];
        email?: string[];
        phone?: string[];
        role?: string[];
        status?: string[];
    };
    message?: string;
};

export async function getEmployees(centerId?: string) {
    try {
        const employees = await EmployeeService.getAll(centerId);
        return JSON.parse(JSON.stringify(employees));
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        return [];
    }
}

export async function addEmployee(prevState: EmployeeState, formData: FormData): Promise<EmployeeState> {
    try {
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            role: formData.get('role') as string,
            status: formData.get('status') as string,
        };

        // Basic validation
        const errors: EmployeeState['errors'] = {};

        if (!data.name || data.name.length < 2) {
            errors.name = ['Name must be at least 2 characters'];
        }
        if (!data.email || !data.email.includes('@')) {
            errors.email = ['Please enter a valid email'];
        }
        if (!data.phone || data.phone.length < 10) {
            errors.phone = ['Please enter a valid phone number'];
        }

        if (Object.keys(errors).length > 0) {
            return { errors };
        }

        const employee = await EmployeeService.create(data);
        revalidatePath('/center/employees');
        return { message: 'success' };
    } catch (error: any) {
        console.error('Failed to create employee:', error);
        return { message: error.message || 'Failed to create employee' };
    }
}

export async function editEmployee(id: string, prevState: EmployeeState, formData: FormData): Promise<EmployeeState> {
    try {
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            role: formData.get('role') as string,
            status: formData.get('status') as string,
        };

        // Basic validation
        const errors: EmployeeState['errors'] = {};

        if (!data.name || data.name.length < 2) {
            errors.name = ['Name must be at least 2 characters'];
        }
        if (!data.email || !data.email.includes('@')) {
            errors.email = ['Please enter a valid email'];
        }
        if (!data.phone || data.phone.length < 10) {
            errors.phone = ['Please enter a valid phone number'];
        }

        if (Object.keys(errors).length > 0) {
            return { errors };
        }

        const employee = await EmployeeService.update(id, data);
        revalidatePath('/center/employees');
        return { message: 'success' };
    } catch (error: any) {
        console.error('Failed to update employee:', error);
        return { message: error.message || 'Failed to update employee' };
    }
}

export async function updateEmployee(id: string, data: any) {
    try {
        const employee = await EmployeeService.update(id, data);
        revalidatePath('/center/employees');
        return { success: true, data: JSON.parse(JSON.stringify(employee)) };
    } catch (error: any) {
        console.error('Failed to update employee:', error);
        return { success: false, error: error.message || 'Failed to update employee' };
    }
}

export async function deleteEmployee(id: string) {
    try {
        await EmployeeService.delete(id);
        revalidatePath('/center/employees');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete employee:', error);
        return { success: false, error: error.message || 'Failed to delete employee' };
    }
}

export async function getEmployeeStats(centerId?: string) {
    try {
        return await EmployeeService.getStats(centerId);
    } catch (error) {
        console.error('Failed to fetch employee stats:', error);
        return { total: 0, active: 0, inactive: 0 };
    }
}

