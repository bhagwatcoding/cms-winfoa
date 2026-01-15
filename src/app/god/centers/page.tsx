"use client";

import { DataTable, StatusBadge, type Column } from "@/features/god";
import { Badge, Button } from "@/ui";
import {
    Building2,
    Plus,
    MapPin,
    Phone,
    Mail,
    Users,
    MoreHorizontal,
} from "lucide-react";

// Mock center data
interface Center {
    id: string;
    name: string;
    code: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    studentCount: number;
    staffCount: number;
}

const mockCenters: Center[] = [
    {
        id: "1",
        name: "Delhi Central",
        code: "DLC001",
        city: "New Delhi",
        state: "Delhi",
        address: "123 Connaught Place",
        phone: "+91 11 2345 6789",
        email: "delhi@example.com",
        isActive: true,
        studentCount: 456,
        staffCount: 12,
    },
    {
        id: "2",
        name: "Mumbai South",
        code: "MBS002",
        city: "Mumbai",
        state: "Maharashtra",
        address: "456 Nariman Point",
        phone: "+91 22 3456 7890",
        email: "mumbai@example.com",
        isActive: true,
        studentCount: 678,
        staffCount: 18,
    },
    {
        id: "3",
        name: "Bangalore Tech Hub",
        code: "BTH003",
        city: "Bangalore",
        state: "Karnataka",
        address: "789 Whitefield",
        phone: "+91 80 4567 8901",
        email: "bangalore@example.com",
        isActive: true,
        studentCount: 534,
        staffCount: 15,
    },
    {
        id: "4",
        name: "Chennai Central",
        code: "CHC004",
        city: "Chennai",
        state: "Tamil Nadu",
        address: "234 Anna Nagar",
        phone: "+91 44 5678 9012",
        email: "chennai@example.com",
        isActive: true,
        studentCount: 321,
        staffCount: 10,
    },
    {
        id: "5",
        name: "Kolkata East",
        code: "KLE005",
        city: "Kolkata",
        state: "West Bengal",
        address: "567 Salt Lake",
        phone: "+91 33 6789 0123",
        email: "kolkata@example.com",
        isActive: false,
        studentCount: 0,
        staffCount: 0,
    },
];

const columns: Column<Center>[] = [
    {
        key: "name",
        header: "Center",
        render: (center) => (
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                    <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="font-medium">{center.name}</p>
                    <Badge variant="outline" className="text-xs">
                        {center.code}
                    </Badge>
                </div>
            </div>
        ),
    },
    {
        key: "city",
        header: "Location",
        render: (center) => (
            <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {center.city}, {center.state}
            </div>
        ),
    },
    {
        key: "phone",
        header: "Contact",
        render: (center) => (
            <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {center.phone}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {center.email}
                </div>
            </div>
        ),
    },
    {
        key: "studentCount",
        header: "Students",
        render: (center) => (
            <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{center.studentCount}</span>
            </div>
        ),
    },
    {
        key: "isActive",
        header: "Status",
        render: (center) => (
            <StatusBadge status={center.isActive ? "active" : "inactive"} />
        ),
    },
    {
        key: "actions",
        header: "",
        className: "w-12",
        render: () => (
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        ),
    },
];

export default function CentersPage() {
    const totalStudents = mockCenters.reduce((sum, c) => sum + c.studentCount, 0);
    const totalStaff = mockCenters.reduce((sum, c) => sum + c.staffCount, 0);
    const activeCenters = mockCenters.filter((c) => c.isActive).length;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Building2 className="h-6 w-6 text-primary" />
                        Training Centers
                    </h1>
                    <p className="text-muted-foreground">
                        Manage training center locations and details
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Center
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Total Centers</p>
                    <p className="text-2xl font-bold">{mockCenters.length}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-emerald-500">{activeCenters}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-card/50 p-4">
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                    <p className="text-2xl font-bold">{totalStaff}</p>
                </div>
            </div>

            {/* Centers Table */}
            <DataTable
                data={mockCenters}
                columns={columns}
                title="All Centers"
                description="Training center locations and their details"
                searchPlaceholder="Search centers..."
            />
        </div>
    );
}
