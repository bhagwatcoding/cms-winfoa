import { MainLayout } from "@/components/center/layout/main-layout";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Center from "@/lib/models/edu/Center";
import Student from "@/lib/models/edu/Student";

export const metadata = {
  title: {
    template: "%s - N.S.D. Education Portal",
    default: "N.S.D. Education Portal",
  },
  description: "Modern Educational Branch Management System",
};

export default async function CenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getSession();
  let userData = null;
  let stats = null;

  if (user) {
    await connectDB();

    // Fetch center data and student stats in parallel
    const [center, studentStats] = await Promise.all([
      Center.findById(user.centerId).lean(),
      Student.aggregate([
        { $match: { centerId: user.centerId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
            },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            }
          }
        }
      ])
    ]);

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

      stats = studentStats[0] || { total: 0, active: 0, completed: 0 };
    }
  }

  return (
    <MainLayout user={userData} stats={stats}>
      {children}
    </MainLayout>
  );
}
