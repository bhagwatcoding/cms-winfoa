'use server';

import connectDB from '@/shared/lib/db';
import { Employee } from '@/models';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/shared/lib/utils';
import { createEmployeeSchema, updateEmployeeSchema } from '@/shared/lib/validations';
import { validateSchema } from '@/shared/lib/validations/utils';

// Get all employees
export async function getEmployees() {
    try {
        await connectDB();
        const employees = await Employee.find()
            .sort({ name: 1 })
            .lean();

        return JSON.parse(JSON.stringify(employees));
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

// Get employee by ID
export async function getEmployeeById(id: string) {
    try {
        await connectDB();
        const employee = await Employee.findById(id).lean();

        return JSON.parse(JSON.stringify(employee));
    } catch (error) {
        console.error('Error fetching employee:', error);
        return null;
    }
}

// Create employee
export async function createEmployee(data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(createEmployeeSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const employee = await Employee.create(validation.data!);

        revalidatePath('/skills/employees');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(employee))
        };
    } catch (error) {
        console.error('Error creating employee:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to create employee'
        };
    }
}

// Update employee
export async function updateEmployee(id: string, data: unknown) {
    try {
        await connectDB();
        // Validate input
        const validation = validateSchema(updateEmployeeSchema, data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.errors?.[0]?.message || 'Invalid input',
                errors: validation.errors
            };
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            { $set: validation.data! },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return { success: false, error: 'Employee not found' };
        }

        revalidatePath('/skills/employees');
        return {
            success: true,
            data: JSON.parse(JSON.stringify(employee))
        };
    } catch (error) {
        console.error('Error updating employee:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to update employee'
        };
    }
}

// Delete employee
export async function deleteEmployee(id: string) {
    try {
        await connectDB();
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return { success: false, error: 'Employee not found' };
        }

        revalidatePath('/skills/employees');
        return { success: true };
    } catch (error) {
        console.error('Error deleting employee:', error);
        return {
            success: false,
            error: getErrorMessage(error) || 'Failed to delete employee'
        };
    }
}
