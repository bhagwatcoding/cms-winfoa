import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { Course, User } from "@/models";
import { getCurrentUser, requireAuth } from "@/shared/lib/session";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const status = searchParams.get("status") || "published";
    const featured = searchParams.get("featured") === "true";

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (status === "published") {
      query.isActive = true;
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (featured) {
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
    const skip = (page - 1) * limit;

    // Execute query
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name email avatar")
        .populate("centerId", "name code")
        .sort({ createdAt: -1, isFeatured: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      message: `Found ${courses.length} courses`,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Require authentication and staff/admin role
    const user = await requireAuth();
    if (!["super-admin", "admin", "staff"].includes(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      code,
      category,
      level = "beginner",
      duration,
      price = 0,
      originalPrice,
      currency = "USD",
      syllabus = [],
      objectives = [],
      prerequisites = [],
      tags = [],
      maxStudents,
      hasCertificate = true,
      passPercentage = 70,
      isFeatured = false,
      modules = [],
    } = body;

    // Validate required fields
    if (!title || !code || !category || !duration) {
      return NextResponse.json(
        { error: "Title, code, category, and duration are required" },
        { status: 400 },
      );
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code: code.toUpperCase() });
    if (existingCourse) {
      return NextResponse.json(
        { error: "Course code already exists" },
        { status: 409 },
      );
    }

    // Create course
    const course = new Course({
      title,
      description,
      code: code.toUpperCase(),
      category,
      level,
      duration,
      price,
      originalPrice,
      currency,
      syllabus,
      objectives,
      prerequisites,
      tags: tags.map((tag: string) => tag.toLowerCase()),
      maxStudents,
      hasCertificate,
      passPercentage,
      isFeatured,
      modules,
      instructor: user.id,
      status: "draft",
      isActive: true,
    });

    await course.save();

    // Populate instructor data for response
    await course.populate("instructor", "name email avatar");

    return NextResponse.json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("Create course error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values((error as any).errors).map(
        (err: any) => err.message,
      );
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(", ")}` },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: "Use PUT /api/academy/courses/[id] to update a specific course" },
    { status: 405 },
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    {
      error: "Use DELETE /api/academy/courses/[id] to delete a specific course",
    },
    { status: 405 },
  );
}
