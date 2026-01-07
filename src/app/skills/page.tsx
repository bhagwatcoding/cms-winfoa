import { DashboardGrid } from "@/features/skills/components";
import { getDashboardStats } from "@/features/skills/actions";

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