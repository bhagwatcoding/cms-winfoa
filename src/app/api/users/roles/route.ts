import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/lib/db";
import { User } from "@/models";
import { requireAuth, requireRole } from "@/shared/lib/session";

// GET /api/users/roles - Get available roles and permissions
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAuth();
    await connectDB();

    // Define role hierarchy and permissions
    const roleDefinitions = {
      "super-admin": {
        name: "Super Administrator",
        description: "Full system access with all permissions",
        level: 100,
        permissions: [
          "users.create",
          "users.read",
          "users.update",
          "users.delete",
          "users.manage-roles",
          "academy.full-access",
          "wallet.full-access",
          "api.full-access",
          "system.settings",
          "system.maintenance"
        ],
        subdomains: ["auth", "academy", "api", "ump", "provider", "myaccount", "wallet", "developer"]
      },
      "admin": {
        name: "Administrator",
        description: "Administrative access to most features",
        level: 90,
        permissions: [
          "users.create",
          "users.read",
          "users.update",
          "academy.manage",
          "wallet.manage",
          "api.manage"
        ],
        subdomains: ["auth", "academy", "api", "ump", "provider", "myaccount", "wallet"]
      },
      "staff": {
        name: "Staff Member",
        description: "Staff access to academy and basic features",
        level: 70,
        permissions: [
          "users.read",
          "academy.create-courses",
          "academy.manage-students",
          "wallet.view"
        ],
        subdomains: ["auth", "academy", "myaccount", "wallet"]
      },
      "center": {
        name: "Training Center",
        description: "Training center management access",
        level: 60,
        permissions: [
          "academy.create-courses",
          "academy.manage-students",
          "academy.generate-certificates",
          "users.view-students"
        ],
        subdomains: ["auth", "academy", "myaccount"]
      },
      "provider": {
        name: "Service Provider",
        description: "Service provider portal access",
        level: 60,
        permissions: [
          "provider.manage-services",
          "provider.manage-clients",
          "provider.view-analytics",
          "wallet.transactions"
        ],
        subdomains: ["auth", "provider", "myaccount", "wallet"]
      },
      "student": {
        name: "Student",
        description: "Student access to learning materials",
        level: 30,
        permissions: [
          "academy.enroll-courses",
          "academy.view-progress",
          "academy.download-certificates",
          "wallet.view-balance"
        ],
        subdomains: ["auth", "academy", "myaccount"]
      },
      "user": {
        name: "Regular User",
        description: "Basic user access",
        level: 20,
        permissions: [
          "profile.view",
          "profile.update",
          "wallet.view-balance"
        ],
        subdomains: ["auth", "myaccount"]
      }
    };

    // Filter roles based on current user permissions
    let availableRoles = roleDefinitions;

    if (currentUser.role !== "super-admin") {
      // Non-super-admins cannot see or assign super-admin role
      const { "super-admin": removed, ...filteredRoles } = roleDefinitions;
      availableRoles = filteredRoles;

      // Regular admins can only assign roles below their level
      if (currentUser.role === "admin") {
        const currentLevel = roleDefinitions.admin.level;
        availableRoles = Object.fromEntries(
          Object.entries(availableRoles).filter(([_, role]) => role.level <= currentLevel)
        );
      }
    }

    // Get role statistics
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0]
            }
          }
        }
      }
    ]);

    const statsMap = roleStats.reduce((acc, stat) => {
      acc[stat._id] = {
        total: stat.count,
        active: stat.active,
        inactive: stat.count - stat.active
      };
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        roles: availableRoles,
        statistics: statsMap,
        currentUserRole: currentUser.role,
        canManageRoles: ["super-admin", "admin"].includes(currentUser.role)
      },
      message: "Roles fetched successfully"
    });

  } catch (error: any) {
    console.error("Get roles error:", error);

    if (error.message === "Unauthorized - Please login") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch roles" },
      { status: 500 }
    );
  }
}

// POST /api/users/roles - Assign role to user
export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireRole(["admin", "super-admin"]);
    await connectDB();

    const body = await request.json();
    const { userId, role, reason } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if current user can assign this role
    const validRoles = ["user", "student", "staff", "center", "provider", "admin"];

    if (currentUser.role !== "super-admin") {
      // Non-super-admin cannot assign super-admin role
      if (role === "super-admin") {
        return NextResponse.json(
          { error: "Only super-admin can assign super-admin role" },
          { status: 403 }
        );
      }

      // Admin cannot modify other admins or super-admins
      if (targetUser.role === "super-admin" ||
          (targetUser.role === "admin" && currentUser.role === "admin")) {
        return NextResponse.json(
          { error: "Insufficient permissions to modify this user's role" },
          { status: 403 }
        );
      }
    }

    if (!validRoles.includes(role) && role !== "super-admin") {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Store previous role for audit
    const previousRole = targetUser.role;

    // Update user role
    targetUser.role = role;
    targetUser.updatedAt = new Date();
    await targetUser.save();

    // Log the role change
    console.log(`🔄 Role changed: ${targetUser.email} from ${previousRole} to ${role} by ${currentUser.email}`);

    // Create audit log (you might want to store this in a separate collection)
    const auditLog = {
      action: "role_change",
      targetUserId: targetUser._id,
      targetUserEmail: targetUser.email,
      performedBy: currentUser._id,
      performedByEmail: currentUser.email,
      previousRole,
      newRole: role,
      reason: reason || "No reason provided",
      timestamp: new Date()
    };

    return NextResponse.json({
      success: true,
      data: {
        userId: targetUser._id,
        email: targetUser.email,
        previousRole,
        newRole: role,
        auditLog
      },
      message: `Role changed from ${previousRole} to ${role} successfully`
    });

  } catch (error: any) {
    console.error("Assign role error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions to assign roles" },
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
      { error: "Failed to assign role" },
      { status: 500 }
    );
  }
}

// PUT /api/users/roles - Bulk role assignment
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await requireRole(["super-admin"]);
    await connectDB();

    const body = await request.json();
    const { userIds, role, reason } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs array is required" },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    const validRoles = ["user", "student", "staff", "center", "provider", "admin", "super-admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Find all target users
    const targetUsers = await User.find({ _id: { $in: userIds } });

    if (targetUsers.length !== userIds.length) {
      return NextResponse.json(
        { error: "Some users were not found" },
        { status: 404 }
      );
    }

    // Update all users
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          role: role,
          updatedAt: new Date()
        }
      }
    );

    // Log bulk role change
    console.log(`🔄 Bulk role change: ${result.modifiedCount} users changed to ${role} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: {
        usersUpdated: result.modifiedCount,
        newRole: role,
        reason: reason || "Bulk role assignment"
      },
      message: `Successfully updated ${result.modifiedCount} users to ${role} role`
    });

  } catch (error: any) {
    console.error("Bulk role assignment error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions for bulk role assignment" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to assign roles" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/roles - Reset user role to default
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await requireRole(["admin", "super-admin"]);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (currentUser.role !== "super-admin") {
      if (targetUser.role === "super-admin" ||
          (targetUser.role === "admin" && currentUser.role === "admin")) {
        return NextResponse.json(
          { error: "Insufficient permissions to modify this user's role" },
          { status: 403 }
        );
      }
    }

    const previousRole = targetUser.role;
    const defaultRole = "user";

    // Reset to default role
    targetUser.role = defaultRole;
    targetUser.updatedAt = new Date();
    await targetUser.save();

    // Log the role reset
    console.log(`🔄 Role reset: ${targetUser.email} from ${previousRole} to ${defaultRole} by ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      data: {
        userId: targetUser._id,
        email: targetUser.email,
        previousRole,
        newRole: defaultRole
      },
      message: `Role reset from ${previousRole} to ${defaultRole} successfully`
    });

  } catch (error: any) {
    console.error("Reset role error:", error);

    if (error.message.includes("Access denied") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        { error: "Insufficient permissions to reset roles" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to reset role" },
      { status: 500 }
    );
  }
}
