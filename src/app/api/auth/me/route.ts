import { NextResponse } from "next/server";
import { SessionCoreService } from "@/shared/services/session";
import type { IUser } from "@/types/models";

export async function GET() {
  try {
    // Get current session with populated user
    const session = await SessionCoreService.getCurrentSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.userId as unknown as IUser;

    // Return user information
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
      },
      session: {
        expires: session.expiresAt,
        lastAccess: session.lastAccessedAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Handle POST requests for session validation
export async function POST() {
  try {
    const session = await SessionCoreService.getCurrentSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.userId as unknown as IUser;

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
