import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { connectDB, Course, Enrollment } from "@/lib/db/models";
import CourseList from "@/features/academy/components/CourseList";
import { Card, CardContent } from "@/ui/card";
import { Skeleton } from "@/ui/skeleton";
import { BookOpen, Filter, Search } from "lucide-react";

async function getCourses(searchParams: {
  search?: string;
  category?: string;
  level?: string;
  featured?: string;
  page?: string;
  limit?: string;
}) {
  try {
    await connectDB();

    const {
      search = "",
      category = "",
      level = "",
      featured = "",
      page = "1",
      limit = "12",
    } = searchParams;

    // Build query
    const query: any = {
      status: "published",
      isActive: true,
    };

    if (category && category !== "All Categories") {
      query.category = category;
    }

    if (level && level !== "All Levels") {
      query.level = level;
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name email avatar")
        .populate("centerId", "name code")
        .sort({
          isFeatured: -1,
          averageRating: -1,
          enrolledStudents: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(query),
    ]);

    return {
      courses: courses.map((course) => ({
        ...course,
        _id: course._id.toString(),
        instructor: {
          ...course.instructor,
          _id: course.instructor._id?.toString(),
        },
        centerId: course.centerId?.toString(),
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      courses: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

async function getUserEnrolledCourses(userId: string) {
  try {
    await connectDB();

    const enrollments = await Enrollment.find({
      student: userId,
      status: { $in: ["active", "completed"] },
    })
      .select("course")
      .lean();

    return enrollments.map((e) => e.course.toString());
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    return [];
  }
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
  } catch (error) {
    console.error("Enrollment error:", error);
    return { success: false, error: error.message };
  }
}

function CoursesPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filter Bar Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Course Grid Skeleton */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="h-80">
            <Skeleton className="h-40 w-full rounded-t-lg" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface CoursesPageProps {
  searchParams: {
    search?: string;
    category?: string;
    level?: string;
    featured?: string;
    page?: string;
    limit?: string;
  };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const user = await getCurrentUser();
  const { courses, pagination } = await getCourses(searchParams);
  const enrolledCourses = user ? await getUserEnrolledCourses(user.id) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Course Catalog
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore our comprehensive collection of courses designed by expert
          instructors
        </p>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
          <span>Academy</span>
          <span>/</span>
          <span className="text-foreground font-medium">Courses</span>
          {searchParams.category &&
            searchParams.category !== "All Categories" && (
              <>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {searchParams.category}
                </span>
              </>
            )}
        </nav>
      </div>

      {/* Course List with built-in filters and search */}
      <Suspense fallback={<CoursesPageSkeleton />}>
        <CourseList
          initialCourses={courses}
          showFilters={true}
          showSearch={true}
          showSort={true}
          showViewToggle={true}
          onEnroll={handleEnrollment}
          enrolledCourses={enrolledCourses}
          featuredOnly={searchParams.featured === "true"}
          categoryFilter={searchParams.category}
          levelFilter={searchParams.level}
        />
      </Suspense>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Expert Instructors</h3>
            <p className="text-sm text-muted-foreground">
              Learn from industry professionals with years of experience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Flexible Learning</h3>
            <p className="text-sm text-muted-foreground">
              Study at your own pace with lifetime access to course materials
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Certificates</h3>
            <p className="text-sm text-muted-foreground">
              Earn industry-recognized certificates upon course completion
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Courses - Learning Academy",
  description:
    "Browse our comprehensive catalog of courses taught by expert instructors",
};
