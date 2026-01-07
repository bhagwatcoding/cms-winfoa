
import { MainLayout } from "@/components/center/layout/main-layout";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Center from "@/lib/models/edu/Center";

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
                joinedAt: user.joinedAt.toISOString(),
                centerName: center.name,
                centerCode: center.code,
                walletBalance: center.walletBalance,
                address: center.address,
                contact: center.contact
            };
        }
    }

    return (
        <MainLayout user={userData}>
            {children}
        </MainLayout>
    );
}
