import { DashboardGrid } from "@/edu/components/dashboard/dashboard-grid";
import { getDashboardStats } from "@/edu/actions/dashboard";

export const metadata = {
    title: "Dashboard"
}

export default async function CenterPage() {
    const stats = await getDashboardStats();
    return (
        <DashboardGrid counts={
            {
                students: stats?.students?.total,
                courses: stats?.courses?.total,
                employees: stats?.employees?.total,
            }
        } />
    );
}