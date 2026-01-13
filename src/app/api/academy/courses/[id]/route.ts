import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { Course, User } from "@/models";
import { requireAuth, requireRole } from "@/shared/lib/session";

// GET /api/academy/courses/[id] - Get specific course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includeModules = searchParams.get("includeModules") === "true";
    const includeStudents = searchParams.get("includeStudents") === "true";

    // Find course by ID or code
    let query = Course.findOne({
      $or: [
        { _id: id },
        { code: id.toUpperCase() }
      ]
    });

    // Populate instructor data
    query = query.populate("instructor", "name email avatar");

    // Populate center data if exists
    query = query.populate("centerId", "name code location");

    const course = await query.lean();

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user can view this course
    try {
      const currentUser = await requireAuth();
      const isInstructor = course.instructor._id.toString() === currentUser.id;
      const isAdmin = ["admin", "super-admin", "staff"].includes(currentUser.role);
      const canViewFull = isInstructor || isAdmin;

      // Add additional data for authorized users
      if (includeStudents && canViewFull) {
        // Get enrolled students count and details
        const enrollmentData = await Course.aggregate([
          { $match: { _id: course._id } },
          { $lookup: {
              from: "students",
              localField: "_id",
              foreignField: "courseId",
              as: "enrollments"
            }
          },
          { $project: {
              totalEnrolled: { $size: "$enrollments" },
              activeEnrolled: {
                $size: {
                  $filter: {
                    input: "$enrollments",
                    cond: { $eq: ["$$this.status", "active"] }
                  }
                }
              }
            }
          }
        ]);

        if (enrollmentData.length > 0) {
          course.enrollmentStats = enrollmentData[0];
        }
      }

      // Return different data based on permissions
      const responseData = {
        ...course,
        permissions: {
          canEdit: canViewFull,
          canDelete: isAdmin,
          canEnroll: !canViewFull && course.status === "published",
          canViewStudents: canViewFull,
          isInstructor
        }
      };

      return NextResponse.json({
        success: true,
        data: responseData
      });

    } catch (authError) {
      // User not authenticated - return public course info only
      if (course.status !== "published") {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      // Return public course information
      const publicData = {
        _id: course._id,
        title: course.title,
        description: course.description,
        code: course.code,
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: course.price,
        originalPrice: course.originalPrice,
        currency: course.currency,
        objectives: course.objectives,
        prerequisites: course.prerequisites,
        tags: course.tags,
        hasCertificate: course.hasCertificate,
        instructor: course.instructor,
        createdAt: course.createdAt,
        permissions: {
          canEdit: false,
          canDelete: false,
          canEnroll: true,
          canViewStudents: false,
          isInstructor: false
        }
      };

      return NextResponse.json({
        success: true,
        data: publicData
      });
    }

  } catch (error: any) {
    console.error("Get course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT /api/academy/courses/[id] - Update specific course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await request.json();

    // Find course
    const course = await Course.findOne({
      $or: [
        { _id: id },
        { code: id.toUpperCase() }
      ]
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isInstructor = course.instructor.toString() === currentUser.id;
    const isAdmin = ["admin", "super-admin", "staff"].includes(currentUser.role);

    if (!isInstructor && !isAdmin) {
      return NextResponse.json(
        { error: "Insufficient permissions to update this course" },
        { status: 403 }
      );
    }

    // Define allowed updates
    const allowedFields = [
      'title', 'description', 'category', 'level', 'duration', 'price',
      'originalPrice', 'syllabus', 'objectives', 'prerequisites', 'tags',
      'maxStudents', 'hasCertificate', 'passPercentage', 'isFeatured',
      'modules', 'status'
    ];

    const updates: any = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });

    // Only admins can change certain fields
    if (!isAdmin) {
      delete updates.isFeatured;
      if (updates.status && !['draft', 'published'].includes(updates.status)) {
        delete updates.status;
      }
    }

    // Update course code only if it's unique
    if (body.code && body.code !== course.code) {
      const existingCourse = await Course.findOne({
        code: body.code.toUpperCase(),
        _id: { $ne: course._id }
      });

      if (existingCourse) {
        return NextResponse.json(
          { error: "Course code already exists" },
          { status: 409 }
        );
      }
      updates.code = body.code.toUpperCase();
    }

    // Update the course
    Object.assign(course, updates);
    course.updatedAt = new Date();
    await course.save();

    // Populate instructor data for response
    await course.populate("instructor", "name email avatar");

    // Log the update
    console.log(`📚 Course updated: ${course.code} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: course,
      message: "Course updated successfully"
    });

  } catch (error: any) {
    console.error("Update course error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Course code already exists" },
        { status: 409 }
      );
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(", ")}` },
        { status: 400 }
      );
    }

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE /api/academy/courses/[id] - Delete specific course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireRole(["admin", "super-admin"]);
    await connectDB();

    const { id } = params;

    // Find course
    const course = await Course.findOne({
      $or: [
        { _id: id },
        { code: id.toUpperCase() }
      ]
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if course has enrolled students
    const studentCount = await Course.aggregate([
      { $match: { _id: course._id } },
      { $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "courseId",
          as: "students"
        }
      },
      { $project: { studentCount: { $size: "$students" } } }
    ]);

    if (studentCount.length > 0 && studentCount[0].studentCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete course with enrolled students. Archive it instead." },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive
    course.isActive = false;
    course.status = "archived";
    course.deletedAt = new Date();
    course.deletedBy = currentUser.id;
    await course.save();

    // Log the deletion
    console.log(`🗑️ Course deleted: ${course.code} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: "Course archived successfully",
      data: {
        id: course._id,
        code: course.code,
        title: course.title,
        archivedAt: course.deletedAt
      }
    });

  } catch (error: any) {
    console.error("Delete course error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}

// PATCH /api/academy/courses/[id] - Partial updates (publish, archive, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { action, ...data } = body;

    // Find course
    const course = await Course.findOne({
      $or: [
        { _id: id },
        { code: id.toUpperCase() }
      ]
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isInstructor = course.instructor.toString() === currentUser.id;
    const isAdmin = ["admin", "super-admin", "staff"].includes(currentUser.role);

    if (!isInstructor && !isAdmin) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    let message = "Course updated successfully";

    // Handle different actions
    switch (action) {
      case "publish":
        if (course.status === "draft") {
          course.status = "published";
          course.publishedAt = new Date();
          message = "Course published successfully";
        } else {
          return NextResponse.json(
            { error: "Course is already published" },
            { status: 400 }
          );
        }
        break;

      case "unpublish":
        if (course.status === "published") {
          course.status = "draft";
          message = "Course unpublished successfully";
        } else {
          return NextResponse.json(
            { error: "Course is not published" },
            { status: 400 }
          );
        }
        break;

      case "feature":
        if (!isAdmin) {
          return NextResponse.json(
            { error: "Only admins can feature courses" },
            { status: 403 }
          );
        }
        course.isFeatured = !course.isFeatured;
        message = `Course ${course.isFeatured ? "featured" : "unfeatured"} successfully`;
        break;

      case "archive":
        if (!isAdmin) {
          return NextResponse.json(
            { error: "Only admins can archive courses" },
            { status: 403 }
          );
        }
        course.status = "archived";
        course.archivedAt = new Date();
        message = "Course archived successfully";
        break;

      case "update-price":
        const { price, originalPrice } = data;
        if (price !== undefined) course.price = price;
        if (originalPrice !== undefined) course.originalPrice = originalPrice;
        message = "Course price updated successfully";
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 }
        );
    }

    await course.save();

    return NextResponse.json({
      success: true,
      data: course,
      message,
      action
    });

  } catch (error: any) {
    console.error("Patch course error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
