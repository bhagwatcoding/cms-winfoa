import { MainLayout } from "@/shared/components/skills";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Center } from "@/models";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = await getSession();
    let userData = null;

    if (user) {
        await connectDB();
        const center = await Center.findById(user.centerId);
        if (center) {
            userData = {
                name: user.name,
                email: user.email,
                role: user.role,
                centerName: center.name,
                walletBalance: center.walletBalance
            };
        }
    }

    return (
        <MainLayout user={userData}>
            {children}
        </MainLayout>
    );
}
