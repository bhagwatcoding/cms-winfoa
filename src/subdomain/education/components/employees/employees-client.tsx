"use client";

import React, { useState } from 'react';
import { UserSquare2, UserCheck, UserCog, Plus, Search, Mail, Phone, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddEmployeeForm } from './add-employee-form';
import { EditEmployeeForm } from './edit-employee-form';
import { deleteEmployee } from '@/lib/actions/edu/employees';

interface Employee {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    status: string;
    joinedAt: string;
}

interface EmployeesClientProps {
    initialEmployees: Employee[];
}

export function EmployeesClient({ initialEmployees }: EmployeesClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const stats = {
        total: initialEmployees.length,
        active: initialEmployees.filter(e => e.status === 'active').length,
        onLeave: initialEmployees.filter(e => e.status === 'on-leave').length,
    };

    const filteredEmployees = initialEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            setIsDeleting(id);
            try {
                await deleteEmployee(id);
            } catch (error) {
                alert('Failed to delete employee');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-teal-100 p-3">
                        <UserSquare2 className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Employees</h1>
                        <p className="text-sm text-slate-500">Manage your branch staff</p>
                    </div>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                </Button>
            </div>

            {isAddOpen && <AddEmployeeForm onClose={() => setIsAddOpen(false)} />}
            {editingEmployee && (
                <EditEmployeeForm
                    employee={editingEmployee}
                    onClose={() => setEditingEmployee(null)}
                />
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <UserSquare2 className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-slate-500">All employees</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                        <p className="text-xs text-slate-500">Working today</p>
                    </CardContent>
                </Card>

                <Card className="col-span-2 md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <UserCog className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.onLeave}</div>
                        <p className="text-xs text-slate-500">Currently away</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search employees by name or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Employee List */}
            <Card>
                <CardHeader>
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>List of all branch employees</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Name</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500 hidden sm:table-cell">Role</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500 hidden md:table-cell">Contact</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500">Status</th>
                                    <th className="pb-3 text-left text-sm font-medium text-slate-500 hidden lg:table-cell">Join Date</th>
                                    <th className="pb-3 text-right text-sm font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee._id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{employee.name}</span>
                                                <span className="text-xs text-slate-500 sm:hidden">{employee.role}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600 hidden sm:table-cell capitalize">{employee.role}</td>
                                        <td className="py-4 hidden md:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-600 flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {employee.email}
                                                </span>
                                                <span className="text-xs text-slate-600 flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {employee.phone || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${employee.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-slate-600 hidden lg:table-cell">
                                            {new Date(employee.joinedAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingEmployee(employee)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Edit className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={isDeleting === employee._id}
                                                    onClick={() => handleDelete(employee._id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredEmployees.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                No employees found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
