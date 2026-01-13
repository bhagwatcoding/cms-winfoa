import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { User } from "@/models";
import { requireAuth, requireRole } from "@/shared/lib/session";

// GET /api/users - List all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Require admin role
    await requireRole(["admin", "super-admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query: any = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { umpUserId: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .populate("centerId", "name code")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        search,
        role,
        status,
        sortBy,
        sortOrder,
      },
      message: `Found ${users.length} users`,
    });

  } catch (error: any) {
    console.error("Get users error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Require admin role
    const currentUser = await requireRole(["admin", "super-admin"]);
    await connectDB();

    const body = await request.json();
    const {
      name,
      email,
      password,
      role = "user",
      phone,
      status = "active",
      centerId,
      isActive = true,
      emailVerified = false,
      walletBalance = 0,
      customPermissions = [],
      permissionOverrides = []
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Validate role permissions
    const allowedRoles = ["user", "student", "staff", "center", "provider", "admin"];
    if (currentUser.role !== "super-admin" && role === "super-admin") {
      return NextResponse.json(
        { error: "Only super-admin can create super-admin users" },
        { status: 403 }
      );
    }

    if (!allowedRoles.includes(role) && role !== "super-admin") {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Generate UMP User ID (WIN-YYYY-XXXXXX format)
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const umpUserId = `WIN-${year}-${randomNum}`;

    // Create new user
    const user = new User({
      umpUserId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password || `temp${Date.now()}`, // Temporary password if not provided
      role,
      phone,
      status,
      centerId,
      isActive,
      emailVerified,
      walletBalance,
      customPermissions,
      permissionOverrides,
      joinedAt: new Date(),
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Populate center info if exists
    if (centerId) {
      await user.populate("centerId", "name code");
    }

    // Log user creation
    console.log(`👥 New user created by ${currentUser.email}: ${user.email} (${user.role})`);

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: `User created successfully with ID: ${umpUserId}`,
    });

  } catch (error: any) {
    console.error("Create user error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User with this email or UMP ID already exists" },
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

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/users - Bulk update users (Super Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Require super-admin role for bulk operations
    await requireRole(["super-admin"]);
    await connectDB();

    const body = await request.json();
    const { userIds, updates } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs array is required" },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Updates object is required" },
        { status: 400 }
      );
    }

    // Remove sensitive fields from bulk updates
    const allowedUpdates = { ...updates };
    delete allowedUpdates.password;
    delete allowedUpdates.email;
    delete allowedUpdates.umpUserId;

    // Execute bulk update
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: allowedUpdates },
      { runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} users`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
    });

  } catch (error: any) {
    console.error("Bulk update users error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Super-admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update users" },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Bulk delete users (Super Admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Require super-admin role for bulk delete
    await requireRole(["super-admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get("ids")?.split(",") || [];

    if (userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs are required" },
        { status: 400 }
      );
    }

    // Check if trying to delete self
    const currentUser = await requireAuth();
    if (userIds.includes(currentUser.id)) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive instead of permanent delete
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          isActive: false,
          status: "inactive",
          deletedAt: new Date(),
          deletedBy: currentUser.id
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: `Deactivated ${result.modifiedCount} users`,
      data: {
        deactivated: result.modifiedCount,
      },
    });

  } catch (error: any) {
    console.error("Bulk delete users error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions. Super-admin access required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
