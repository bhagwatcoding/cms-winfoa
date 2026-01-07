
import React from 'react';
import { EmployeesClient } from '@/shared/components/skills';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Employee } from '@/models';
import { redirect } from 'next/navigation';

export default async function EmployeesPage() {
    const { user } = await getSession();

    if (!user) {
        redirect('/login');
    }

    await connectDB();

    // Fetch employees belonging to this center
    const employeesData = await Employee.find({
        centerId: user.centerId
    }).sort({ createdAt: -1 });

    // Serialize Mongoose documents to plain objects
    const employees = employeesData.map(emp => ({
        _id: emp._id.toString(),
        name: emp.name,
        email: emp.email,
        phone: emp.phone || '',
        designation: emp.designation,
        salary: emp.salary || 0,
        status: emp.status,
        joiningDate: emp.joiningDate ? emp.joiningDate.toISOString() : new Date().toISOString(),
    }));

    return <EmployeesClient employees={employees} />;
}
