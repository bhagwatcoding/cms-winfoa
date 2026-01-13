import { NextRequest, NextResponse } from "next/server";
import { connectDB, Course, Enrollment, User } from "@/lib/db/models";
import { getCurrentUser, requireAuth } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");
    const centerId = searchParams.get("centerId");

    // Get current user for access control
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Build query based on user role and parameters
    const query: any = {};

    // Role-based access control
    if (currentUser.role === "student") {
      // Students can only see their own enrollments
      query.student = currentUser.id;
    } else if (currentUser.role === "staff" || currentUser.role === "center") {
      // Staff can see enrollments from their center
      if (currentUser.centerId) {
        query.centerId = currentUser.centerId;
      }
    } else if (!["super-admin", "admin"].includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Apply filters
    if (studentId && ["super-admin", "admin", "staff"].includes(currentUser.role)) {
      query.student = studentId;
    }

    if (courseId) {
      query.course = courseId;
    }

    if (status) {
      query.status = status;
    }

    if (centerId && ["super-admin", "admin"].includes(currentUser.role)) {
      query.centerId = centerId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [enrollments, total] = await Promise.all([
      Enrollment.find(query)
        .populate("student", "name email avatar profile")
        .populate("course", "title code thumbnail price duration instructor")
        .populate("centerId", "name code")
        .sort({ enrollmentDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enrollment.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: enrollments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      message: `Found ${enrollments.length} enrollments`,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { courseId, studentId, paymentAmount, paymentStatus = "pending", centerId } = body;

    // Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Determine the actual student ID
    let actualStudentId = studentId;
    if (!actualStudentId) {
      // If no studentId provided, enroll the current user (self-enrollment)
      if (currentUser.role !== "student" && currentUser.role !== "user") {
        return NextResponse.json(
          { error: "Student ID is required for staff enrollments" },
          { status: 400 }
        );
      }
      actualStudentId = currentUser.id;
    } else {
      // Only staff/admin can enroll other students
      if (!["super-admin", "admin", "staff"].includes(currentUser.role)) {
        return NextResponse.json(
          { error: "Insufficient permissions to enroll other students" },
          { status: 403 }
        );
      }
    }

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if course exists and is available for enrollment
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (!course.isEnrollmentOpen()) {
      return NextResponse.json(
        { error: "Course enrollment is closed" },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await User.findById(actualStudentId);
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: actualStudentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Student is already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: actualStudentId,
      course: courseId,
      centerId: centerId || currentUser.centerId,
      paymentAmount: paymentAmount || course.price,
      paymentStatus: course.price === 0 ? "free" : paymentStatus,
      currency: course.currency,
      enrolledBy: currentUser.id !== actualStudentId ? currentUser.id : undefined,
      status: "active",
      progress: {
        completedLessons: [],
        completedModules: [],
        totalLessonsCompleted: 0,
        overallProgress: 0,
        lastAccessedAt: new Date(),
        timeSpent: 0,
      },
      engagement: {
        loginCount: 1,
        totalTimeSpent: 0,
        averageSessionTime: 0,
        lastLoginAt: new Date(),
        forumPosts: 0,
        questionsAsked: 0,
        assignmentsSubmitted: 0,
      },
    });

    await enrollment.save();

    // Update course enrollment count
    await course.enrollStudent();

    // Populate data for response
    await enrollment.populate("student", "name email avatar profile");
    await enrollment.populate("course", "title code thumbnail price duration instructor");

    return NextResponse.json({
      success: true,
      data: enrollment,
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.error("Create enrollment error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(", ")}` },
        { status: 400 }
      );
    }

    // Handle duplicate enrollment error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Student is already enrolled in this course" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Use PUT /api/academy/enrollments/[id] to update a specific enrollment" },
    { status: 405 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: "Use DELETE /api/academy/enrollments/[id] to delete a specific enrollment" },
    { status: 405 }
  );
}
