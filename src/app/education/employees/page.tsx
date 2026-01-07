
import React from 'react';
import { EmployeesClient } from '@/components/center/employees/employees-client';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/edu/User';
import { redirect } from 'next/navigation';

export default async function EmployeesPage() {
    const { user } = await getSession();

    if (!user) {
        redirect('/login');
    }

    await connectDB();

    // Fetch employees (users who are not students) belonging to this center
    const employeesData = await User.find({
        centerId: user.centerId,
        role: { $ne: 'student' }
    }).sort({ createdAt: -1 });

    // Serialize Mongoose documents to plain objects
    const employees = employeesData.map(emp => ({
        _id: emp._id.toString(),
        name: emp.name,
        email: emp.email,
        role: emp.role,
        phone: emp.phone || '',
        status: emp.status,
        joinedAt: emp.joinedAt.toISOString(),
    }));

    return <EmployeesClient initialEmployees={employees} />;
}
