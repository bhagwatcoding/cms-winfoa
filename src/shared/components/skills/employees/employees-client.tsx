'use client'

import {
    Card, CardContent, CardHeader, CardTitle,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
    Badge,
    Button
} from '@/ui'

import { Edit, Trash2 } from 'lucide-react'

interface Employee {
    _id: string
    name: string
    email: string
    phone: string
    designation: string
    salary: number
    joiningDate: string
    status: string
}

interface EmployeesClientProps {
    employees: Employee[]
}

export function EmployeesClient({ employees }: EmployeesClientProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Employees</h1>
                <Button>Add Employee</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Employees</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No employees found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees.map((employee) => (
                                    <TableRow key={employee._id}>
                                        <TableCell className="font-medium">{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.phone}</TableCell>
                                        <TableCell>{employee.designation}</TableCell>
                                        <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                                                {employee.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
