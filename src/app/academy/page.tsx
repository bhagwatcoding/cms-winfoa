import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import connectDB from "@/lib/db";
import { Course, Enrollment } from "@/models";
import {
  Card, CardContent, CardHeader, CardTitle,
  Button, Badge
} from "@/ui";

import CourseCard from "@/features/academy/components/CourseCard";
import CourseList from "@/features/academy/components/CourseList";
import {
  BookOpen, Users, Award, TrendingUp, Clock, Star, PlayCircle, Plus, ArrowRight, GraduationCap, Target, Calendar, BarChart3,
} from "lucide-react";

async function getAcademyStats(userId?: string, userRole?: string) {
  try {
    await connectDB();

    // Get featured courses
    const featuredCourses = await Course.find({
      status: "published",
      isActive: true,
      isFeatured: true,
    })
      .populate("instructor", "name email avatar")
      .limit(6)
      .lean();

    // Get overall stats
    const [totalCourses, totalStudents, totalInstructors] = await Promise.all([
      Course.countDocuments({ status: "published", isActive: true }),
      Enrollment.distinct("student").then((students) => students.length),
      Course.distinct("instructor").then((instructors) => instructors.length),
    ]);

    let userStats: any = null;
    let userEnrollments: any[] = [];

    // Get user-specific data
    if (userId) {
      if (userRole === "student") {
        userEnrollments = await Enrollment.find({ student: userId })
          .populate("course", "title code thumbnail price duration instructor")
          .sort({ enrollmentDate: -1 })
          .limit(5)
          .lean();

        const completedCount = await Enrollment.countDocuments({
          student: userId,
          status: "completed",
        });

        const inProgressCount = await Enrollment.countDocuments({
          student: userId,
          status: "active",
        });

        userStats = {
          enrolledCourses: userEnrollments.length,
          completedCourses: completedCount,
          inProgressCourses: inProgressCount,
          certificatesEarned: await Enrollment.countDocuments({
            student: userId,
            certificateIssued: true,
          }),
        };
      } else if (userRole && ["staff", "admin", "super-admin"].includes(userRole)) {
        const instructorCourses = await Course.find({ instructor: userId });
        const totalEnrollments = await Enrollment.countDocuments({
          course: { $in: instructorCourses.map((c) => c._id) },
        });

        userStats = {
          coursesCreated: instructorCourses.length,
          totalStudents: totalEnrollments,
          activeCourses: instructorCourses.filter(
            (c) => c.status === "published",
          ).length,
          draftCourses: instructorCourses.filter((c) => c.status === "draft")
            .length,
        };
      }
    }

    // Get recent enrollments for stats
    const recentEnrollments = await Enrollment.find()
      .populate("student", "name email avatar")
      .populate("course", "title code thumbnail")
      .sort({ enrollmentDate: -1 })
      .limit(10)
      .lean();

    return {
      featuredCourses,
      totalCourses,
      totalStudents,
      totalInstructors,
      userStats,
      userEnrollments,
      recentEnrollments,
    };
  } catch (error) {
    console.error("Error fetching academy stats:", error);
    return {
      featuredCourses: [],
      totalCourses: 0,
      totalStudents: 0,
      totalInstructors: 0,
      userStats: null,
      userEnrollments: [],
      recentEnrollments: [],
    };
  }
}

function StatsCard({
  icon: Icon,
  title,
  value,
  description,
  color = "blue",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  description: string;
  color?: "blue" | "green" | "purple" | "orange" | "yellow" | "red";
}) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-100 dark:bg-green-900/20",
    purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
    orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
    yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
    red: "text-red-600 bg-red-100 dark:bg-red-900/20",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-full ${colorClasses[color]} flex-shrink-0`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function handleEnrollment(courseId: string) {
  "use server";

  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/academy/enrollments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          studentId: user.id,
        }),
      },
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Enrollment failed");
    }

    return { success: true };
  } catch (e: unknown) {
    console.error("Enrollment error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
}

export default async function AcademyPage() {
  const user = await getCurrentUser();
  const stats = await getAcademyStats(user?.id, user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            Learning Academy
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "student"
              ? "Discover and enroll in courses to enhance your skills"
              : "Manage courses and track student progress"}
          </p>
        </div>

        <div className="flex gap-2">
          {["staff", "admin", "super-admin"].includes(user?.role || "") && (
            <Link href="/courses/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Course
              </Button>
            </Link>
          )}
          <Link href="/courses">
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === "student" && stats.userStats ? (
          <>
            <StatsCard
              icon={BookOpen}
              title="Enrolled Courses"
              value={stats.userStats.enrolledCourses || 0}
              description="Total courses enrolled"
              color="blue"
            />
            <StatsCard
              icon={TrendingUp}
              title="In Progress"
              value={stats.userStats.inProgressCourses || 0}
              description="Currently studying"
              color="orange"
            />
            <StatsCard
              icon={Award}
              title="Completed"
              value={stats.userStats.completedCourses || 0}
              description="Courses completed"
              color="green"
            />
            <StatsCard
              icon={Star}
              title="Certificates"
              value={stats.userStats.certificatesEarned || 0}
              description="Certificates earned"
              color="purple"
            />
          </>
        ) : user?.role &&
          ["staff", "admin", "super-admin"].includes(user.role) &&
          stats.userStats ? (
          <>
            <StatsCard
              icon={BookOpen}
              title="My Courses"
              value={stats.userStats.coursesCreated || 0}
              description="Courses created"
              color="blue"
            />
            <StatsCard
              icon={Users}
              title="My Students"
              value={stats.userStats.totalStudents || 0}
              description="Total enrollments"
              color="green"
            />
            <StatsCard
              icon={Target}
              title="Active Courses"
              value={stats.userStats.activeCourses || 0}
              description="Currently published"
              color="orange"
            />
            <StatsCard
              icon={Clock}
              title="Draft Courses"
              value={stats.userStats.draftCourses || 0}
              description="In development"
              color="yellow"
            />
          </>
        ) : (
          <>
            <StatsCard
              icon={BookOpen}
              title="Total Courses"
              value={stats.totalCourses}
              description="Available courses"
              color="blue"
            />
            <StatsCard
              icon={Users}
              title="Total Students"
              value={stats.totalStudents}
              description="Enrolled students"
              color="green"
            />
            <StatsCard
              icon={Award}
              title="Instructors"
              value={stats.totalInstructors}
              description="Expert instructors"
              color="purple"
            />
            <StatsCard
              icon={Star}
              title="Featured"
              value={stats.featuredCourses.length}
              description="Featured courses"
              color="orange"
            />
          </>
        )}
      </div>
      <CourseList />
      {/* User-specific sections */}
      {user?.role === "student" && stats.userEnrollments.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Continue Learning
            </CardTitle>
            <Link href="/my-courses">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.userEnrollments.slice(0, 3).map((enrollment: any) => (
                <Card
                  key={enrollment._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {enrollment.course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Progress: {enrollment.progress?.overallProgress || 0}%
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                            style={{
                              width: `${enrollment.progress?.overallProgress || 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Featured Courses */}
      {stats.featuredCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Featured Courses
              </h2>
              <p className="text-muted-foreground">
                Hand-picked courses from expert instructors
              </p>
            </div>
            <Link href="/courses?featured=true">
              <Button variant="outline">
                View All Featured
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.featuredCourses.slice(0, 6).map((course: any) => (
              <CourseCard
                key={course._id}
                course={course}
                variant="featured"
                onEnroll={() => handleEnrollment(course._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/courses">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Browse All Courses</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explore our complete catalog of courses
              </p>
              <Badge variant="secondary">
                {stats.totalCourses} courses available
              </Badge>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/certificates">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Certificates</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View and download your certificates
              </p>
              <Badge variant="secondary">Earn certificates</Badge>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/support">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Academic Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help with your studies
              </p>
              <Badge variant="secondary">24/7 support</Badge>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity (for staff/admin) */}
      {["staff", "admin", "super-admin"].includes(user?.role || "") &&
        stats.recentEnrollments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentEnrollments.slice(0, 5).map((enrollment: any) => (
                  <div
                    key={enrollment._id}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {enrollment.student?.name} enrolled in{" "}
                        {enrollment.course?.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          enrollment.enrollmentDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Empty State for new users */}
      {user?.role === "student" && stats.userEnrollments.length === 0 && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Welcome to the Academy!
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start your learning journey by enrolling in your first course.
                Explore our catalog and find the perfect course for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/courses?featured=true">
                  <Button>
                    <Star className="h-4 w-4 mr-2" />
                    View Featured Courses
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse All Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export const metadata = {
  title: "Academy Dashboard - Winfoa Platform",
  description: "Learning management dashboard for courses and student progress",
};
